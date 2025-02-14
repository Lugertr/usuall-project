import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectShopToken } from 'src/app/store/auth/auth.selectors';
import { loadShopSuccess, setShopToken } from 'src/app/store/auth/auth.actions';
import { CurRoutes } from 'src/app/app.routes';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.store.select(selectShopToken).pipe(
      take(1),
      switchMap(shopToken => {
        let modifiedRequest = request;
        if (shopToken) {
          console.log('test')
          console.log(shopToken)
          modifiedRequest = request.clone({
            setHeaders:  { Authorization: `Bearer ${shopToken}` }
          });
        }
        return next.handle(modifiedRequest)
        .pipe(
          catchError((err: unknown) => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
              this.store.dispatch(setShopToken({ shopToken: null }));
              this.store.dispatch(loadShopSuccess({ shop: null }));
              this.router.navigate([`/${CurRoutes.Auth}`]);
            }
            return throwError(() => err);
          })
        );

      })
    );
  }
}
