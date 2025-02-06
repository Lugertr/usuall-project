import { Injectable, OnDestroy, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Signal, signal, computed } from '@angular/core';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { of, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoadingBarService } from '@core/loading-bar/loading-bar.service';

export interface LoginDeliveryReq {
  clientID: string;
  clientSecret: string;
  userID: string;
}

export interface LoginWSAReq {
  object_id: string;
  wsa_token: string;
  userID: string;
}

export interface StoreInfo {
  id: number;
  insales_id: string;
  shop_url: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cookieService = inject(CookieService);
  private loadingBarSrv = inject(LoadingBarService);
  private informer = inject(ToastrService);

  private destroy$ = new Subject<void>

  private tokenKey = 'auth-token';

  private user = signal<any>(null);
  private storeInfo = signal<StoreInfo>(null);

  constructor() {
    this.loadUserFromCookie();
    this.loadStoreInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sync() {
    return this.http
      .post(
        '/api/v1/back_office/synchronous_menu',
        //'/api/v1/back_office/synchronous_menu',
        {}
      )
  }

  login(req: LoginDeliveryReq | LoginWSAReq) {
    return this.http
      .post(
        '/api/v1/back_office/setup_profile',
        //'/api/v1/back_office/setup_profile',
        req
      )
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  logout(): void {
    this.removeToken();
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticatedSignal(): Signal<boolean> {
    return computed(() => !!this.user());
  }

  private setToken(token: string): void {
    this.cookieService.set(this.tokenKey, token, {
      expires: 7, // Срок действия cookie (7 дней)
      path: '/', // Доступно на всем сайте
      secure: true, // Только для HTTPS
      sameSite: 'Lax',
    });
  }

  private getToken(): string | null {
    return this.cookieService.get(this.tokenKey) || null;
  }

  private removeToken(): void {
    this.cookieService.delete(this.tokenKey, '/');
  }

  private loadUserFromCookie(): void {
    const token = this.getToken();
    if (token) {
      this.http.get(
        '/api/auth/me'
        //'/api/auth/me'
      ).pipe(this.loadingBarSrv.withLoading() ,takeUntil(this.destroy$)).subscribe((user) => {
        this.user.set(user);
      });
    }
  }

  private loadStoreInfo(): void {
    let params = new HttpParams({
      fromObject: {
        token3: environment.storeInfo.token3,
        user_email: environment.storeInfo.user_email,
        user_name: environment.storeInfo.user_name,
        user_id: environment.storeInfo.user_id,
        email_confirmed: environment.storeInfo.email_confirmed
      }
    });
    this.http
      .get<StoreInfo>('/autologin', {
        params,
      }).pipe(this.loadingBarSrv.withLoading() ,
      catchError((err) => {
        this.informer.error(err.message || err.detail || err);
        let params = new HttpParams({
          fromObject: {
            user_email: environment.storeInfo.user_email,
            user_id: environment.storeInfo.user_id,
            insales_id: environment.storeInfo.insales_id,

          }
        });

        return of(null);
      }),
      takeUntil(this.destroy$))
      .subscribe((store) => {
        this.storeInfo.set(store);
      });
  }
}
