import { createReducer, on } from '@ngrx/store';
import { loadUser, loadUserFailure, loadUserSuccess, setToken } from './auth.actions';
import { AuthState } from 'src/app/models/auth';

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,

  on(setToken, (state, { token }) => ({
    ...state,
    token
  })),

  on(loadUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(loadUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user
  })),

  on(loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
