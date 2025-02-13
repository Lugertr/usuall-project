import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { LoadingBarService } from '@core/loading-bar/loading-bar.service';
import { AsyncPipe } from '@angular/common';
import { takeUntil } from 'rxjs';
import { DestroyService } from '@core/services/destroy.service';
import { LoginDescComponent } from './login-desc/login-desc.component';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '@core/auth/auth.service';
import { InformerService } from '@core/services/informer.service';
import { selectShopToken } from 'src/app/store/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

enum LoginType {
  Delivery,
  WSA,
}
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
  private authService = inject(AuthService);
  private loadingBarSrv = inject(LoadingBarService);
  private destroy$ = inject(DestroyService);
  private informer = inject(InformerService);
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  hidePassword = true;
  private userId: number = environment.storeInfo.user_id;

  loginForm = this.fb.group({
    type: [LoginType.Delivery, [Validators.required]],
    name: ['', [Validators.required]],
    secret: ['', Validators.required],
  });

  loginType = LoginType;
  loading$ = this.loadingBarSrv.show$;

  hasShopToken: boolean;

  get loginNameLabel(): string {
    switch (this.loginForm.value.type) {
      case LoginType.Delivery:
        return 'ClientId';
      case LoginType.WSA:
        return 'ObjectID';
    }
  }

  get loginSecretLabel(): string {
    switch (this.loginForm.value.type) {
      case LoginType.Delivery:
        return 'ClientSecret';
      case LoginType.WSA:
        return 'WSAToken';
    }
  }

  ngOnInit(): void {
    this.store
      .select(selectShopToken)
      .pipe(takeUntil(this.destroy$))
      .subscribe((shopToken) => {
        this.hasShopToken = !!shopToken;
        this.cdr.markForCheck();
      });
  }

  onSync(): void {
    this.authService
      .sync()
      .pipe(this.loadingBarSrv.withLoading(), takeUntil(this.destroy$))
      .subscribe({
        next: () => this.informer.success('Синхронизация успешна'),
        error: (err) => this.informer.error(err, 'Ошибка синхронизации'),
      });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { type, name, secret } = this.loginForm.value;

    const req =
      type === LoginType.Delivery
        ? { clientID: name, clientSecret: secret, userID: `${this.userId}` }
        : { object_id: name, wsa_token: secret, userID: `${this.userId}` };

    this.authService.signClient(req)
      .pipe(this.loadingBarSrv.withLoading(), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.informer.success('Авторизация клиента упешна');
          this.router.navigate(['/main']);
        },
        error: (err) => {
          this.informer.error(err, 'Ошибка авторизации клиента');
        },
      });
  }
}
