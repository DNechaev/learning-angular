import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    // PageNotFoundComponent,
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    AuthModule,
    UsersModule,
    AppRoutingModule,
  ],
  /*providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],*/
  bootstrap: [AppComponent]
})
export class AppModule {}
