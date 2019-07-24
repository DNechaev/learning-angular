import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { ToastService } from '../services/toast.service';
import { LoaderIndicatorService } from '../services/loader-indicator.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthenticationService,
    private toastService: ToastService,
    private loaderIndicatorService: LoaderIndicatorService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Enable loader
    this.loaderIndicatorService.enable();

    request = request.clone({
      setHeaders: {
        'X-SSID': this.auth.getToken()
      }
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('[AuthInterceptor] Error', error.error);
        if (error.status !== 401) {
          this.toastService.warning(error.message + ': ' + JSON.stringify(error.error));
        } else {
          this.toastService.danger('Unauthorized! Try repeat Sign in.');
        }
        return throwError(error);
      }),
      finalize(() => {
        this.loaderIndicatorService.disable();
      })
    );

  }

}
