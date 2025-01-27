import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/auth/login.component').then(c => c.LoginComponent) },
  { path: '', loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
