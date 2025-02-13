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
  removeAuthorizedUser,
  removeAuthorizedUserFailure,
  removeAuthorizedUserSuccess,
  updateShop,
  updateShopFailure,
  updateShopSuccess,
} from './auth.actions';
import { selectShopToken } from './auth.selectors';
import { LoadingBarService } from '@core/loading-bar/loading-bar.service';
import { CurRoutes } from 'src/app/app.routes';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store,
    private loadingBarSrv: LoadingBarService,
    private router: Router
  ) {}

  loadShop$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadShop),
      withLatestFrom(this.store.select(selectShopToken)),
      switchMap(([_, token]) => {
        console.log(!token);
        if (!token) return of(loadShopFailure({ error: 'No token' }));
        return this.authService.getShop().pipe(
          this.loadingBarSrv.withLoading(),
          map((shop) => {
            if (shop) {
              return loadShopSuccess({ shop });
            }
            return loadShopFailure({ error: 'shop is empty' });
          }),
          catchError((error) => {
            return of(loadShopFailure({ error: error }));
          })
        );
      })
    )
  );

  updateShop$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateShop),
      switchMap(({ shop }) =>
        this.authService.updShop(shop).pipe(
          this.loadingBarSrv.withLoading(),
          map((updatedShop) => updateShopSuccess({ shop: updatedShop })),
          catchError((error) => of(updateShopFailure({ error: error.message })))
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

  removeAuthorizedUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeAuthorizedUser),
      switchMap(({ userId }) => {
        return this.authService.logoutUser(userId).pipe(
          this.loadingBarSrv.withLoading(),
          map(() => removeAuthorizedUserSuccess({ userId })),
          catchError((error) => of(removeAuthorizedUserFailure({ error: error.message }))),
          tap(() => {
            this.router.navigate([`/${CurRoutes.Auth}`]);
          })
        );
      })
    )
  );
}
