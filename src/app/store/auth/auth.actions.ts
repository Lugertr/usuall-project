import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/auth';

export const setToken = createAction('[Auth] Set Token', props<{ token: string }>());

export const loadUser = createAction('[Auth] Load User');
export const loadUserSuccess = createAction('[Auth] Load User Success', props<{ user: User }>());
export const loadUserFailure = createAction('[Auth] Load User Failure', props<{ error: string }>());

export const updateUser = createAction('[Auth] Update User', props<{ user: User }>());
export const updateUserSuccess = createAction('[Auth] Update User Success', props<{ user: User }>());
export const updateUserFailure = createAction('[Auth] Update User Failure', props<{ error: string }>());
