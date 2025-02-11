import { createReducer, on } from '@ngrx/store';
import {
  loadUser,
  loadUserFailure,
  loadUserSuccess,
  setToken,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from './auth.actions';
import { AuthState } from 'src/app/models/auth';

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  on(setToken, (state, { token }) => ({
    ...state,
    token,
  })),


  on(loadUser, (state) => ({ ...state, loading: true, error: null })),
  on(loadUserSuccess, (state, { user }) => ({ ...state, user, loading: false })),
  on(loadUserFailure, (state, { error }) => ({ ...state, error, loading: false })),


  on(updateUser, (state) => ({ ...state, loading: true, error: null })),
  on(updateUserSuccess, (state, { user }) => ({ ...state, user, loading: false })),
  on(updateUserFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
