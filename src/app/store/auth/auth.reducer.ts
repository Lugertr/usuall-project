import { createReducer, on } from '@ngrx/store';
import {
  loadShop,
  loadShopFailure,
  loadShopSuccess,
  setShopToken,
  updateShop,
  updateShopFailure,
  updateShopSuccess,
} from './auth.actions';
import { Shop } from 'src/app/models/auth';

export interface AuthState {
  shopToken: string | null;
  shop: Shop | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  shopToken: null,
  shop: null,
  loading: false,
  error: null,
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
  }))
);
