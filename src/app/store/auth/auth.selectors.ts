import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurRoutes } from 'src/app/app.routes';
import { AuthState } from 'src/app/models/auth';

export const selectAuthState = createFeatureSelector<AuthState>(CurRoutes.Auth);

export const selectShopToken = createSelector(selectAuthState, (state) => state.shopToken);
export const selectShop = createSelector(selectAuthState, (state) => state.shop);

export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);

export const selectAuthorizedUsers = createSelector(
  selectAuthState,
  (state) => state.authorizedUsers
);

export const selectAuthorizedUserByID = createSelector(
  selectAuthState,
  (state, props: { userID: string }) =>
    state.authorizedUsers.find((user) => user.userID === props.userID)
);

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.currentUser
);
