import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { AuthRoutesPath } from './auth.routing';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.authenticationService.getCurrentUser()) {
      return true;
    }

    this.router.navigate([ AuthRoutesPath.PATH_TO_LOGIN ], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
