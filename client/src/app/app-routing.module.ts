import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AuthGuard } from './auth/auth.guard';
import { UsersRoutesPath } from './users/users.routing';

export const enum AppRoutesPath {
  HOME = UsersRoutesPath.PATH_TO_LIST,
}

const routes: Routes = [
  { path: '', redirectTo: '' + AppRoutesPath.HOME, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
