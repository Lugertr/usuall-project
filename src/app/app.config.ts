import {
  ApplicationConfig,
  importProvidersFrom,
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
} from '@angular/common/http';
import { AuthHttpInterceptor } from './core/auth/auth-http-interceptor';
import { provideStore, StoreModule } from '@ngrx/store';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { EffectsModule } from '@ngrx/effects';

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
    importProvidersFrom(
      ToastrModule.forRoot(),
      StoreModule.forRoot({ auth: authReducer }),
      EffectsModule.forRoot([AuthEffects])
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      deps: [APP_BASE_HREF],
      multi: true,
    },
    provideHttpClient(withFetch()),
    CookieService,
    provideStore(),
  ],
};
