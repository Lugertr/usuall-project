import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RestHttpClient } from '@core/rest-http-client/rest-http-client.service';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/models/auth';
import { loadUserSuccess, setToken } from 'src/app/store/auth/auth.actions';

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
  private router = inject(Router);

  getUser(): Observable<User> {
    return this.http.get<User>('/api/auth/users/me');
    return of({
      id: 1,
      email: 'user@example.com',
      is_active: true,
      is_superuser: false,
      is_verified: false,
      role: 'admin',
      shop_url: 'https://shop.example.com',
      insales_id: 12345,
      is_synchronous: true,
      is_custom_field_added: true,
      export_type: 0
    });

  }

  updUser(user: User): Observable<User> {
    return this.http.patch<User>('/api/auth/users/me', user)
    return of(user);
  }

  sync(test?:any) {
    return this.http.post('/api/v1/back_office/synchronous_menu', {});
  }

  logout(): void {
    this.store.dispatch(setToken({ token: null }));
    this.store.dispatch(loadUserSuccess({ user: null }));
    this.router.navigate(['/auth']);
  }
}
