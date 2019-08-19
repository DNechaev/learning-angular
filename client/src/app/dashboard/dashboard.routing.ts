import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../auth/auth.guard';

export const enum DashboardRoutesPath {
  ROOT = 'dashboard',
  PATH_DASHBOARD = '/dashboard',
}

export const ModuleRoutes: Routes = [
  {
    path: DashboardRoutesPath.ROOT,
    component: DashboardComponent,
    canActivate: [ AuthGuard ]
  }
];
