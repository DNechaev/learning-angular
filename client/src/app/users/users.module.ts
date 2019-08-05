import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { SearchComponent } from '../shared/components/search/search.component';
import { ModuleRoutes } from './users.routing';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersAddComponent } from './users-add/users-add.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { MainLayoutComponent } from '../shared/layout/main-layout/main-layout.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ModuleRoutes),
    SharedModule
  ],
  declarations: [
    MainLayoutComponent,
    SearchComponent,
    UsersComponent,
    UsersListComponent,
    UsersAddComponent,
    UsersEditComponent
  ],
})
export class UsersModule {}
