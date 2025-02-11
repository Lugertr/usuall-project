import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from '@core/auth/auth.service';
import { loadUser, loadUserFailure, loadUserSuccess, updateUser, updateUserFailure, updateUserSuccess } from './auth.actions';
import { selectToken } from './auth.selectors';
import { LoadingBarService } from '@core/loading-bar/loading-bar.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store,
    private loadingBarSrv: LoadingBarService
  ) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([_, token]) => {
        if (!token) return of(loadUserFailure({ error: 'No token' }));
        return this.authService.getUser().pipe(
          map((user) => loadUserSuccess({ user })),
          catchError((error) => of(loadUserFailure({ error: error.message })))
        );
      })
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      switchMap(({ user }) =>
        this.authService.updUser(user).pipe(
          this.loadingBarSrv.withLoading(),
          map((updatedUser) => updateUserSuccess({ user: updatedUser })),
          catchError((error) => of(updateUserFailure({ error: error.message })))
        )
      )
    )
  );

  reloadUserAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserSuccess),
      map(() => loadUser())
    )
  );
}
