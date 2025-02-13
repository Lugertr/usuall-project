import { createReducer, on } from '@ngrx/store';
import {
  addAuthorizedUser,
  loadShop,
  loadShopFailure,
  loadShopSuccess,
  removeAuthorizedUserFailure,
  removeAuthorizedUserSuccess,
  setCurrentUser,
  setShopToken,
  updateShop,
  updateShopFailure,
  updateShopSuccess,
} from './auth.actions';
import { AuthState } from 'src/app/models/auth';

const initialState: AuthState = {
  shopToken: null,
  shop: null,
  loading: false,
  error: null,
  authorizedUsers: [],
  currentUser: null,
};

export const authReducer = createReducer(
  initialState,

  on(setShopToken, (state, { shopToken }) => ({
    ...state,
    shopToken,
  })),

  on(loadShop, (state) => ({ ...state, loading: true, error: null })),
  on(loadShopSuccess, (state, { shop }) => ({
    ...state,
    shop,
    loading: false,
  })),
  on(loadShopFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(updateShop, (state) => ({ ...state, loading: true, error: null })),
  on(updateShopSuccess, (state, { shop }) => ({
    ...state,
    shop,
    loading: false,
  })),
  on(updateShopFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(addAuthorizedUser, (state, { user }) => ({
    ...state,
    authorizedUsers: [...state.authorizedUsers, user],
  })),

  on(setCurrentUser, (state, { user }) => ({
    ...state,
    currentUser: user,
  })),

  on(removeAuthorizedUserSuccess, (state, { userId }) => ({
    ...state,
    authorizedUsers: state.authorizedUsers.filter(
      (user) => user.userId !== userId
    ),
    currentUser:
      state.currentUser?.userId === userId ? null : state.currentUser,
  })),

  on(removeAuthorizedUserFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
