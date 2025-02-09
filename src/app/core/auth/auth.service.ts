import { computed, inject, Injectable, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { RestHttpClient } from '@core/rest-http-client/rest-http-client.service';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { StoreInfo, User } from 'src/app/models/auth';
import { login, logout, setStoreInfo } from 'src/app/store/auth/auth.actions';

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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(RestHttpClient);
  private store = inject(Store);
  private cookieService = inject(CookieService);

  login(
    req: LoginDeliveryReq | LoginWSAReq
  ): Observable<{ token: string; user: User }> {
    return this.http
      .post<{ token: string; user: User }>(
        '/api/v1/back_office/setup_profile',
        req
      )
      .pipe(
        tap((response) => {
          this.cookieService.set('authToken', response.token, 1, '/');
          this.store.dispatch(login({ user: response.user }));
        })
      );
  }

  sync() {
    return this.http.post('/api/v1/back_office/synchronous_menu', {});
  }

  logout(username: string): void {
    this.cookieService.delete('authToken');
    this.store.dispatch(logout({username}));
  }

  loadStoreInfo(storeInfo: StoreInfo): void {
    this.cookieService.set('storeInfo', JSON.stringify(storeInfo), 1, '/');
    this.store.dispatch(setStoreInfo({ storeInfo }));
  }

  getStoreInfo(): StoreInfo {
    const data = this.cookieService.get('storeInfo');
    return data ? JSON.parse(data) : null;
  }

  getToken(): string {
    return this.cookieService.get('authToken') || null;
  }

  isAuthenticatedSignal(): Signal<boolean> {
    return computed(() => !!!!this.getToken());
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
