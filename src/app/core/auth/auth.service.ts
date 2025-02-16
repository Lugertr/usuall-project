import { inject, Injectable } from '@angular/core';
import { RestHttpClient } from '@core/rest-http-client/rest-http-client.service';
import { catchError, mergeMap, Observable, of, take, tap, timer } from 'rxjs';
import { ExportType, LoginDelivery, LoginWSA, Shop } from 'src/app/models/auth';

export interface BaseLogin {
  export_type: ExportType;
}

export interface LoginDeliveryReq extends BaseLogin, LoginDelivery {
  export_type: ExportType.Delivery;
}

export interface LoginWSAReq extends BaseLogin, LoginWSA {
  export_type: ExportType.WSA;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(RestHttpClient);

  getShop(): Observable<Shop> {
    return this.http.get<Shop>('/api/auth/users/me');
  }

  updShop(body: LoginDeliveryReq | LoginWSAReq): Observable<Shop> {
    return this.http.patch<Shop>('/api/auth/users/me', body);
  }

  sync(): Observable<void> {
    return this.http.get('/api/back_office/synchorinization_menu').pipe(
      mergeMap(t => {
        return timer(0, 8000).pipe(take(5));
      }),
      mergeMap(() => this.getSyncStatus()),
    );
  }

  private getSyncStatus(): Observable<void> {
    return this.http.get('/api/back_office/progress_bar');
  }
}
