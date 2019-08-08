import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ModuleRoutes } from './auth.routing';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegistrationComponent } from './registration/registration.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ModuleRoutes),
    SharedModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    LogoutComponent,
    RegistrationComponent
  ],
})
export class AuthModule {}
