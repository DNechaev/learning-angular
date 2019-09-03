import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ModuleRoutes } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ModuleRoutes),
    SharedModule
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule {}
