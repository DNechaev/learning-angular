import { Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersAddComponent } from './users-add/users-add.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersResolverService } from './users-resolver.service';

export const enum UsersRoutesPath {
  ROOT = 'users',
  LIST = '',
  ADD  = 'new',
  EDIT = ':id',
  PATH_TO_LIST = '/users',
  PATH_TO_ADD  = '/users/new',
  PATH_TO_EDIT = '/users/' // + id
}

export const ModuleRoutes: Routes = [
  {
    path: UsersRoutesPath.ROOT,
    component: UsersComponent,
    children: [
      { path: UsersRoutesPath.LIST, component: UsersListComponent, canActivate: [AuthGuard] },
      { path: UsersRoutesPath.ADD,  component: UsersAddComponent,  canActivate: [AuthGuard] },
      { path: UsersRoutesPath.EDIT, component: UsersEditComponent, canActivate: [AuthGuard],  resolve: { user: UsersResolverService } }
    ]
  }
];
