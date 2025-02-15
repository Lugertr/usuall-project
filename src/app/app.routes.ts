import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/auth.guard';

export const enum CurRoutes {
  Auth = 'auth',
  Main = 'main',
  Profile = 'profile',
}

export const routes: Routes = [
  {
    path: CurRoutes.Auth,
    loadComponent: () =>
      import('./components/auth/login.component').then((c) => c.LoginComponent),
  },
  {
    path: CurRoutes.Main,
    loadComponent: () =>
      import('./components/home/home.component').then((c) => c.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: CurRoutes.Profile,
    loadComponent: () =>
      import('./components/profile/profile.component').then(
        (c) => c.ProfileComponent,
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: CurRoutes.Auth },
];
