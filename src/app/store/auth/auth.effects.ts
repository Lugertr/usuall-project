import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { loadUsersFromCookies } from './auth.actions';

@Injectable()
export class AuthEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsersFromCookies),
      map(() => loadUsersFromCookies())
    )
  );

  constructor(private actions$: Actions) {}
}
