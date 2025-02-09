import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectUsers = createSelector(selectAuthState, (state) => state.users);
export const selectStoreInfo = createSelector(selectAuthState, (state) => state.storeInfo);
