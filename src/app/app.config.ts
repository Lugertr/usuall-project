import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CookieService } from 'ngx-cookie-service';
import { ToastrModule } from 'ngx-toastr';
import { PlatformLocation, APP_BASE_HREF } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthHttpInterceptor } from './core/auth/auth-http-interceptor';
import { provideStore } from '@ngrx/store';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { provideEffects } from '@ngrx/effects';
import { AuthInit } from '@core/auth/auth-init.initializer';

export const getBaseHref: (plSrv: PlatformLocation) => string = (
  plSrv: PlatformLocation
) => plSrv.getBaseHrefFromDOM();

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: getBaseHref,
      deps: [PlatformLocation],
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore({ auth: authReducer }),
    provideAppInitializer(AuthInit),
    provideEffects(AuthEffects),
    CookieService,
    importProvidersFrom(ToastrModule.forRoot()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      deps: [APP_BASE_HREF],
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ],
};
