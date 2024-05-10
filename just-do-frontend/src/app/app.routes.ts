import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './auth/auth.guard';
import { InitialComponent } from './components/initial/initial.component';

export const routes: Routes = [
  { path: '', component: InitialComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '/' },
];
