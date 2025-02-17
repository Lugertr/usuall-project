import { inject, Injectable } from '@angular/core';
import { RestHttpClient } from '@core/rest-http-client/rest-http-client.service';
import { catchError, delay, forkJoin, map, mergeMap, Observable, of, switchMap, take, takeWhile, tap, timer } from 'rxjs';
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

  private statusProgressMap = new Map<string, number>([
    ['Start synchronization process', 10],
    ['Categories deleted successfully', 20],
    ['Products deleted successfully', 30],
    ['Product fields deleted successfully', 40],
    ['Custom fields already added', 50],
    ['Custom statuses already added', 60],
    ['Categories created successfully', 70],
    ['Product field created successfully', 80],
    ['Products and Images created successfully', 90],
    ['Synchronization process completed', 100],
  ]);

  getShop(): Observable<Shop> {
    return this.http.get<Shop>('/api/auth/users/me');
  }

  updShop(body: LoginDeliveryReq | LoginWSAReq): Observable<Shop> {
    return this.http.patch<Shop>('/api/auth/users/me', body);
  }

  sync(): Observable<[void, number]> {
    return forkJoin([
      this.http.get<void>('/api/back_office/synchorinization_menu').pipe(take(1)),
      timer(0, 8000).pipe(
        delay(2000),
        switchMap(() => {
          return this.getSyncStatus().pipe(
            map(status => {
              return this.statusProgressMap.get(status?.message[status.message.length - 1]) || null;
            }),
            takeWhile(progress => progress < this.statusProgressMap['Synchronization process completed'], true)
          );
        })
      ),
    ]);
  }

  private getSyncStatus(): Observable<{message: string[]}> {
    return this.http.get('/api/back_office/progress_bar');
  }
}
