import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/components/home.component';
import { LoginComponent } from './features/auth/components/login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];