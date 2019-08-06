import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { AppRoutesPath } from 'src/app/app-routing.module';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.authenticationService.currentUserValue) {
      return true;
    }

    this.router.navigate([ AppRoutesPath.HOME ], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
