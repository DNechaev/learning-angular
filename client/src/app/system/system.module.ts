import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SystemComponent } from './system.component';
import { UsersListComponent } from './users/users-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './search/search.component';
import { UsersFormComponent } from './users/users-form.component';

@NgModule({
  declarations: [
    SearchComponent,
    SystemComponent,
    UsersListComponent,
    UsersFormComponent,
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    SharedModule,
    NgbPaginationModule
  ],
  exports: [],
  providers: [],
})
export class SystemModule {}
