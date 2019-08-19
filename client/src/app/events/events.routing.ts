import { Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { EventsComponent } from './events.component';
import { EventsListComponent } from './events-list/events-list.component';
import { EventsAddComponent } from './events-add/events-add.component';
import { EventsEditComponent } from './events-edit/events-edit.component';
import { EventsResolverService } from './events-resolver.service';

export const enum EventsRoutesPath {
  ROOT = 'events',
  LIST = '',
  ADD  = 'new',
  EDIT = ':id',
  PATH_TO_LIST = '/events',
  PATH_TO_ADD  = '/events/new',
  PATH_TO_EDIT = '/events/' // + id
}

export const ModuleRoutes: Routes = [
  {
    path: EventsRoutesPath.ROOT,
    component: EventsComponent,
    children: [
      { path: EventsRoutesPath.LIST, component: EventsListComponent, canActivate: [AuthGuard] },
      { path: EventsRoutesPath.ADD,  component: EventsAddComponent,  canActivate: [AuthGuard] },
      { path: EventsRoutesPath.EDIT, component: EventsEditComponent, canActivate: [AuthGuard],  resolve: { event: EventsResolverService } }
    ]
  }
];
