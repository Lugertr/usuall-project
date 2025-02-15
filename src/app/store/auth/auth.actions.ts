import { LoginDeliveryReq, LoginWSAReq } from '@core/auth/auth.service';
import { createAction, props } from '@ngrx/store';
import { Shop } from 'src/app/models/auth';

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
  props<{ req: LoginDeliveryReq | LoginWSAReq }>()
);
export const updateShopSuccess = createAction(
  '[Auth] Update Shop Success',
  props<{ shop: Shop }>()
);
export const updateShopFailure = createAction(
  '[Auth] Update Shop Failure',
  props<{ error: string }>()
);
