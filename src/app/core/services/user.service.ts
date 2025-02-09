import { computed, inject, Injectable, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { RestHttpClient } from '@core/rest-http-client/rest-http-client.service';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { StoreInfo, User } from 'src/app/models/auth';
import { login, logout, setStoreInfo } from 'src/app/store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(RestHttpClient);

  test(): void{
    this.http.get('/api/auth/users/me').subscribe(console.log)
  }
}
