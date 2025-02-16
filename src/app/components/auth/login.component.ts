import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { LoadingBarService } from '@core/loading-bar/loading-bar.service';
import { AsyncPipe } from '@angular/common';
import { combineLatest, take, takeUntil } from 'rxjs';
import { DestroyService } from '@core/services/destroy.service';
import { LoginDescComponent } from './login-desc/login-desc.component';
import { MatCardModule } from '@angular/material/card';
import { selectShop, selectShopToken } from 'src/app/store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ExportType, LoginDelivery, LoginWSA } from 'src/app/models/auth';
import { updateShop, updateShopSuccess } from 'src/app/store/auth/auth.actions';
import { CurRoutes } from 'src/app/app.routes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    LoginDescComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private loadingBarSrv = inject(LoadingBarService);
  private destroy$ = inject(DestroyService);
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  hidePassword = true;
  hasShopToken: boolean;
  isEdit = false;
  loading$ = this.loadingBarSrv.show$;

  loginForm = this.fb.group({
    type: [ExportType.Delivery, [Validators.required]],
    name: ['', [Validators.required]],
    secret: ['', Validators.required],
  });

  exportType = ExportType;

  get loginNameLabel(): string {
    switch (this.loginForm.value.type) {
      case ExportType.Delivery:
        return 'ClientId';
      case ExportType.WSA:
        return 'ObjectID';
    }
  }

  get loginSecretLabel(): string {
    switch (this.loginForm.value.type) {
      case ExportType.Delivery:
        return 'ClientSecret';
      case ExportType.WSA:
        return 'WSAToken';
    }
  }

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    this.isEdit = navigation?.extras.state?.isEdit || false;
  }

  ngOnInit(): void {
    combineLatest([this.store.select(selectShopToken), this.store.select(selectShop)])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([shopToken, shop]) => {
        if (shop?.params && !this.isEdit) {
          this.router.navigate([CurRoutes.Main]);
        } else {
          this.hasShopToken = !!shopToken;
          console.log('test');
          console.log(this.isEdit);
          if (this.isEdit) {
            let formData: { type: ExportType; name: string; secret: string };
            switch (shop.export_type) {
              case this.exportType.Delivery:
                const userVal = shop.params as LoginDelivery;
                formData = {
                  type: shop.export_type,
                  name: userVal.client_id,
                  secret: userVal.client_secret,
                };
              case this.exportType.WSA:
                const user = shop.params as LoginWSA;
                formData = {
                  type: shop.export_type,
                  name: user.object_id,
                  secret: user.wsa_token,
                };
            }

            this.loginForm.setValue(formData);
            this.loginForm.updateValueAndValidity();
            console.log(formData);
          }
          this.cdr.markForCheck();
        }
      });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { type, name, secret } = this.loginForm.value;

    const req =
      type === ExportType.Delivery
        ? { client_id: name, client_secret: secret, export_type: type }
        : { object_id: name, wsa_token: secret, export_type: type };

    this.store.dispatch(updateShop({ req }));
    this.router.navigate([CurRoutes.Main]);

    this.store
      .select(updateShopSuccess)
      .pipe(take(1), this.loadingBarSrv.withLoading(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate([CurRoutes.Main]);
      });
  }
}
