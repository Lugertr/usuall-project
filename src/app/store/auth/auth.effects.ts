import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from '@core/auth/auth.service';
import {
  loadShop,
  loadShopFailure,
  loadShopSuccess,
  updateShop,
  updateShopFailure,
  updateShopSuccess,
} from './auth.actions';
import { selectShopToken } from './auth.selectors';
import { LoadingBarService } from '@core/loading-bar/loading-bar.service';
import { InformerService } from '@core/services/informer.service';
import { Router } from '@angular/router';
import { CurRoutes } from 'src/app/app.routes';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store,
    private loadingBarSrv: LoadingBarService,
    private informer: InformerService,
    private router: Router
  ) {}

  loadShop$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadShop),
      withLatestFrom(this.store.select(selectShopToken)),
      switchMap(([_, token]) => {
        if (!token) {
          this.router.navigate([CurRoutes.Auth]);
          throw new Error('Нет токена');
        }
        return this.authService
          .getShop()
          .pipe(this.loadingBarSrv.withLoading());
      }),
      map((shop) => {
        if (shop) {
          return loadShopSuccess({ shop });
        }
        return loadShopFailure({ error: 'shop is empty' });
      }),
      catchError((error) => {
        this.informer.error(error, 'Ошибка авторизации клиента');
        return of(loadShopFailure({ error: error }));
      })
    )
  );

  updateShop$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateShop),
      switchMap(({ req }) =>
        this.authService.updShop(req).pipe(
          this.loadingBarSrv.withLoading(),
          map((updatedShop) => updateShopSuccess({ shop: updatedShop })),
          tap(() => {
            this.informer.success('Авторизация клиента упешна');
          }),
          catchError((error) => {
            this.informer.error(error, 'Ошибка авторизации клиента');
            return of(updateShopFailure({ error: error.message }));
          })
        )
      )
    )
  );

  reloadShopAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateShopSuccess),
      map(() => loadShop())
    )
  );
}
