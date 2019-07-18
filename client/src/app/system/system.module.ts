import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SystemComponent } from './system.component';
import { UsersComponent } from './users/users.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    SystemComponent,
    UsersComponent,
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    SharedModule,
    NgbPaginationModule
  ],
  exports: [ UsersComponent ],
  entryComponents: [ UsersComponent ],
  providers: [],
})
export class SystemModule {}
