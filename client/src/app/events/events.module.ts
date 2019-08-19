import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ModuleRoutes } from './events.routing';
import { EventsComponent } from './events.component';
import { EventsListComponent } from './events-list/events-list.component';
import { EventsAddComponent } from './events-add/events-add.component';
import { EventsEditComponent } from './events-edit/events-edit.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ModuleRoutes),
    SharedModule
  ],
  declarations: [
    EventsComponent,
    EventsListComponent,
    EventsAddComponent,
    EventsEditComponent
  ],
})
export class EventsModule {}
