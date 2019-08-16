import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { MenuComponent } from './components/menu/menu.component';
import { GridComponent } from './components/grid/grid.component';
import { SearchComponent } from './components/search/search.component';
import { ToastsComponent } from './components/toasts.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { CurrentUserProvider, CurrentUserProviderFactory } from './providers/current-user.provider';

@NgModule({
  imports: [
    RouterModule.forChild([]),
    BrowserModule,
    NgbModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    GridComponent,
    ToastsComponent,
    PageNotFoundComponent,
    SearchComponent,
    MenuComponent,
    AuthLayoutComponent,
    MainLayoutComponent
  ],
  providers: [
    CurrentUserProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: CurrentUserProviderFactory,
      deps: [ CurrentUserProvider ],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  exports: [
    BrowserModule,
    NgbModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    GridComponent,
    ToastsComponent,
    PageNotFoundComponent,
    SearchComponent,
    MenuComponent,
    AuthLayoutComponent,
    MainLayoutComponent
  ],
})
export class SharedModule {}
