import { Routes } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegistrationComponent } from './registration/registration.component';

export const enum AuthRoutesPath {
  ROOT = 'auth',
  LOGIN = 'login',
  LOGOUT = 'logout',
  REGISTRATION = 'registration',
  PATH_TO_LOGIN = '/auth/login',
  PATH_TO_LOGOUT = '/auth/logout',
  PATH_TO_REGISTRATION = '/auth/registration',
}

export const ModuleRoutes: Routes = [
  { path: AuthRoutesPath.ROOT, component: AuthComponent, children: [
      { path: '', redirectTo: AuthRoutesPath.PATH_TO_LOGIN, pathMatch: 'full' },
      { path: AuthRoutesPath.LOGIN, component: LoginComponent },
      { path: AuthRoutesPath.LOGOUT, component: LogoutComponent },
      { path: AuthRoutesPath.REGISTRATION, component: RegistrationComponent }
  ]}
];
