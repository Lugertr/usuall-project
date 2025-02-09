import { createAction, props } from '@ngrx/store';
import { StoreInfo, User } from 'src/app/models/auth';

export const setStoreInfo = createAction(
  '[Store] Set Store Info',
  props<{ storeInfo: StoreInfo }>()
);

export const login = createAction(
  '[Auth] Login',
  props<{ user: User }>()
);

export const logout = createAction(
  '[Auth] Logout',
  props<{ username: string }>()
);

export const loadUsersFromCookies = createAction('[Auth] Load Users From Cookies');
