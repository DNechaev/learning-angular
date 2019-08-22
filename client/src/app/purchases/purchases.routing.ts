import { Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { PurchasesComponent } from './purchases.component';
import { PurchasesListComponent } from './purchases-list/purchases-list.component';
import { PurchasesAddComponent } from './purchases-add/purchases-add.component';
import { PurchasesEditComponent } from './purchases-edit/purchases-edit.component';
import { PurchasesResolverService } from './purchases-resolver.service';

export const enum PurchasesRoutesPath {
  ROOT = 'purchases',
  LIST = '',
  ADD  = 'new',
  EDIT = ':id',
  PATH_TO_LIST = '/purchases',
  PATH_TO_ADD  = '/purchases/new',
  PATH_TO_EDIT = '/purchases/' // + id
}

export const ModuleRoutes: Routes = [
  {
    path: PurchasesRoutesPath.ROOT,
    component: PurchasesComponent,
    children: [
      { path: PurchasesRoutesPath.LIST, component: PurchasesListComponent, canActivate: [AuthGuard] },
      { path: PurchasesRoutesPath.ADD,  component: PurchasesAddComponent,  canActivate: [AuthGuard] },
      {
        path: PurchasesRoutesPath.EDIT,
        component: PurchasesEditComponent,
        canActivate: [AuthGuard],
        resolve: { purchase: PurchasesResolverService }
      }
    ]
  }
];
