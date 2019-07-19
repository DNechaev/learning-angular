import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemComponent } from './system.component';
import { AuthGuard } from '../shared/guards/auth.guard';

import { UsersListComponent } from './users/users-list.component';
import { UsersFormComponent } from './users/users-form.component';

const routes: Routes = [
  { path: 'system', component: SystemComponent, children: [
      { path: '', redirectTo: '/system/users', pathMatch: 'full' },
      { path: 'users', component: UsersListComponent, canActivate: [AuthGuard] },
      { path: 'users/:id', component: UsersFormComponent, canActivate: [AuthGuard] },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}
