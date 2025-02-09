import { createReducer, on } from '@ngrx/store';
import { login, logout, loadUsersFromCookies, setStoreInfo } from './auth.actions';
import { CookieService } from 'ngx-cookie-service';
import { StoreInfo, User } from 'src/app/models/auth';

export interface AuthState {
  users: User[];
  storeInfo: StoreInfo | null;
}

const initialState: AuthState = {
  users: [],
  storeInfo: null
};

function getUsersFromCookies(): User[] {
  const cookieService = new CookieService(document, document.cookie);
  const users = cookieService.get('loggedUsers');
  return users ? JSON.parse(users) : [];
}

function saveUsersToCookies(users: User[]): void {
  const cookieService = new CookieService(document, document.cookie);
  cookieService.set('loggedUsers', JSON.stringify(users), 1, '/');
}

export const authReducer = createReducer(
  initialState,
  on(loadUsersFromCookies, state => ({ ...state, users: getUsersFromCookies() })),
  on(login, (state, { user }) => {
    const users = [...state.users, user];
    saveUsersToCookies(users);
    return { ...state, users };
  }),
  on(logout, (state, { username }) => {
    const users = state.users.filter(u => u.username !== username);
    saveUsersToCookies(users);
    return { ...state, users };
  }),
  on(setStoreInfo, (state, { storeInfo }) => ({
    ...state,
    storeInfo
  }))
);
