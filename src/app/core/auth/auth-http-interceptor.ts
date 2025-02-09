import { APP_BASE_HREF } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(@Inject(APP_BASE_HREF) private baseHref: string, private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getToken();
    let req: Observable<HttpEvent<unknown>>;

    if (authToken) {
      const clonedReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      req = next.handle(clonedReq);
    } else {
      req = next.handle(request);
    }


    return req.pipe(
      catchError((err: unknown) => {
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
