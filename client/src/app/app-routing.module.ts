import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AuthGuard } from './auth/auth.guard';
import { DashboardRoutesPath } from './dashboard/dashboard.routing';

export const enum AppRoutesPath {
  HOME = DashboardRoutesPath.PATH_DASHBOARD,
}

const routes: Routes = [
  { path: '', redirectTo: '' + AppRoutesPath.HOME, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, canActivate: [ AuthGuard ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
