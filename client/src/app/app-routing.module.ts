import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/404/page-not-found.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
