import { Routes } from '@angular/router';

import { AuthGuard } from '../shared/guards/auth.guard';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersAddComponent } from './users-add/users-add.component';
import { UsersEditComponent } from './users-edit/users-edit.component';

export const UsersRoutes: Routes = [
  {
    path: 'users',
    component: UsersComponent,
    children: [
      { path: '',    component: UsersListComponent, canActivate: [AuthGuard] },
      { path: 'new', component: UsersAddComponent,  canActivate: [AuthGuard] },
      { path: ':id', component: UsersEditComponent, canActivate: [AuthGuard] }
    ]
  }
];
