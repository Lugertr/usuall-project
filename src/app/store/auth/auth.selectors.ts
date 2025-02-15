import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurRoutes } from 'src/app/app.routes';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>(CurRoutes.Auth);

export const selectShopToken = createSelector(
  selectAuthState,
  (state) => state.shopToken,
);
export const selectShop = createSelector(
  selectAuthState,
  (state) => state.shop,
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading,
);
export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error,
);
