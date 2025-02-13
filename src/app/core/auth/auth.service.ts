import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RestHttpClient } from '@core/rest-http-client/rest-http-client.service';
import { Store } from '@ngrx/store';
import { catchError, Observable, of, tap } from 'rxjs';
import { CurRoutes } from 'src/app/app.routes';
import { ClientToken, LoginDeliveryReq, LoginWSAReq, Shop } from 'src/app/models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(RestHttpClient);
  private store = inject(Store);
  private router = inject(Router);

  getShop(): Observable<Shop> {
    return this.http.get<Shop>('/api/auth/users/me').pipe(
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }

  updShop(shop: Shop): Observable<Shop> {
    return this.http.patch<Shop>('/api/auth/users/me', shop);
  }

  signClient(body: LoginDeliveryReq | LoginWSAReq)  {
    return this.http.post<ClientToken>('/api/v1/back_office/synchronous_menu', body);
  }

  sync(): Observable<void> {
    return this.http.post<void>('/api/v1/back_office/synchronous_menu', {});
  }

  logoutUser(user_id: string): Observable<void> {
    return this.http.post<void>('/api/v1/back_office/synchronous_menu', {});
  }
}
