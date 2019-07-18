import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemComponent } from './system.component';
import { UsersComponent } from './users/users.component';
import { AuthGuard } from '../shared/guards/auth.guard';


const routes: Routes = [
  { path: 'system', component: SystemComponent, children: [
      { path: 'users', component: UsersComponent/*, canActivate: [AuthGuard]*/ },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}
