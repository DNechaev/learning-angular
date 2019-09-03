import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ModuleRoutes } from './purchases.routing';
import { PurchasesComponent } from './purchases.component';
import { PurchasesListComponent } from './purchases-list/purchases-list.component';
import { PurchasesAddComponent } from './purchases-add/purchases-add.component';
import { PurchasesEditComponent } from './purchases-edit/purchases-edit.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ModuleRoutes),
    SharedModule
  ],
  declarations: [
    PurchasesComponent,
    PurchasesListComponent,
    PurchasesAddComponent,
    PurchasesEditComponent
  ],
})
export class PurchasesModule {}
