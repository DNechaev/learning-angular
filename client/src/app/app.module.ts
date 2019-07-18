import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AuthModule } from './auth/auth.module';
import { SystemModule } from './system/system.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { PageNotFoundComponent } from './shared/404/page-not-found.component';
import { AuthenticationService } from './shared/services/authentication.service';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    SystemModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
