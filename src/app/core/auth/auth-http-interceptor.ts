import { APP_BASE_HREF } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(@Inject(APP_BASE_HREF) private baseHref: string) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          setTimeout(() => {
            window.location.replace(`${this.baseHref || '/'}auth`);
          }, 0);
        }
        return throwError(err);
      }),
    );
  }
}
