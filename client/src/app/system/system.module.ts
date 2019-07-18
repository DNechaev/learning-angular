import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SystemComponent } from './system.component';
import { UsersComponent } from './users/users.component';
import {AuthenticationService} from '../shared/services/authentication.service';


@NgModule({
  declarations: [
    SystemComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    SharedModule
  ],
  providers: [AuthenticationService],
})
export class SystemModule {}
