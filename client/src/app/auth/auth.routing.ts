import { Routes } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegistrationComponent } from './registration/registration.component';

export const ModuleRoutes: Routes = [
  { path: 'auth', component: AuthComponent, children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'logout', component: LogoutComponent },
      { path: 'registration', component: RegistrationComponent }
  ]}
];
