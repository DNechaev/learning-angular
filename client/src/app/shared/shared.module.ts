import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastsComponent } from './components/toasts.component';

@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ToastsComponent,
  ],
  exports: [BrowserModule, NgbModule, NgbPaginationModule, FormsModule, ReactiveFormsModule, ToastsComponent],
})
export class SharedModule {}
