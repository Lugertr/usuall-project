import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from '@core/auth/auth.service';
import { loadUser, loadUserFailure, loadUserSuccess } from './auth.actions';
import { selectToken } from './auth.selectors';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store
  ) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([_, token]) => {
        if (!token) return of(loadUserFailure({ error: 'No token' }));
        console.log('test');
        return this.authService.getUser().pipe(
          map((user) => loadUserSuccess({ user })),
          catchError((error) => of(loadUserFailure({ error: error.message })))
        );
      })
    )
  );
}
