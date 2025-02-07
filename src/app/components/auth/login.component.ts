import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  AuthService,
  LoginDeliveryReq,
  LoginWSAReq,
} from '@core/auth/auth.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { LoadingBarService } from '@core/loading-bar/loading-bar.service';
import { AsyncPipe } from '@angular/common';
import { takeUntil } from 'rxjs';
import { DestroyService } from '@core/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { LoginDescComponent } from './login-desc/login-desc.component';
import { MatCardModule } from '@angular/material/card';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

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
  private informer = inject(ToastrService);
  private route = inject(ActivatedRoute);

  hidePassword = true;
  private userId: number = null;

  loginForm = this.fb.group({
    type: [LoginType.Delivery, [Validators.required]],
    name: ['', [Validators.required]],
    secret: ['', Validators.required],
  });

  loginType = LoginType;
  loading$ = this.loadingBarSrv.show$;

  get loginNameLabel() {
    switch (this.loginForm.value.type) {
      case LoginType.Delivery:
        return 'ClientId';
      case LoginType.WSA:
        return 'ObjectID';
    }
  }

  get loginSecretLabel() {
    switch (this.loginForm.value.type) {
      case LoginType.Delivery:
        return 'ClientSecret';
      case LoginType.WSA:
        return 'WSAToken';
    }
  }
  
  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const insales_id = params.get('insales_id') || null;
      const shop = params.get('shop') || null;
      const user_email = params.get('user_email') || null;
      const user_id = Number(params.get('user_id')) || null;
      console.log(user_id);
      console.log(params);
      console.log('test');
      this.userId = user_id;
      this.authService.loadStoreInfo({
        insales_id,
        shop,
        user_email,
        user_id,
      });
    })
  }

  onSync(): void {
    this.authService
      .sync()
      .pipe(this.loadingBarSrv.withLoading(), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.informer.success('Синхронизация успешна');
        },
        error: (err) => {
          this.informer.error(err.message, 'Ошибка синхронизации');
        },
      });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    let req: LoginDeliveryReq | LoginWSAReq;

    switch (this.loginForm.value.type) {
      case LoginType.Delivery:
        req = {
          clientID: this.loginForm.value.name,
          clientSecret: this.loginForm.value.secret,
          userID: `${this.userId}`,
        };
      case LoginType.WSA:
        req = {
          object_id: this.loginForm.value.name,
          wsa_token: this.loginForm.value.secret,
          userID: `${this.userId}`,
        };
    }

    if (!req) return;

    this.authService
      .login(req)
      .pipe(this.loadingBarSrv.withLoading(), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.informer.success('Авторизация упешна');
        },
        error: (err) => {
          this.informer.error(err.message, 'Ошибка авторизации');
        },
      });
  }
}
