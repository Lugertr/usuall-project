import { createAction, props } from '@ngrx/store';
import { Shop, User } from 'src/app/models/auth';

export const setShopToken = createAction(
  '[Auth] Set Shop Token',
  props<{ shopToken: string }>()
);

export const loadShop = createAction('[Auth] Load Shop');
export const loadShopSuccess = createAction(
  '[Auth] Load Shop Success',
  props<{ shop: Shop }>()
);
export const loadShopFailure = createAction(
  '[Auth] Load Shop Failure',
  props<{ error: string }>()
);

export const updateShop = createAction(
  '[Auth] Update Shop',
  props<{ shop: Shop }>()
);
export const updateShopSuccess = createAction(
  '[Auth] Update Shop Success',
  props<{ shop: Shop }>()
);
export const updateShopFailure = createAction(
  '[Auth] Update Shop Failure',
  props<{ error: string }>()
);

export const addAuthorizedUser = createAction(
  '[Auth] Add Authorized User',
  props<{ user: User }>()
);
export const setCurrentUser = createAction(
  '[Auth] Set Current User',
  props<{ user: User }>()
);
export const removeAuthorizedUser = createAction(
  '[Auth] Remove Authorized User',
  props<{ userId: string }>()
);
export const removeAuthorizedUserSuccess = createAction(
  '[Auth] Remove Authorized User Success',
  props<{ userId: string }>()
);
export const removeAuthorizedUserFailure = createAction(
  '[Auth] Remove Authorized User Failure',
  props<{ error: string }>()
);
