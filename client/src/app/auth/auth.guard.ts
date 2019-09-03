import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthRoutesPath } from './auth.routing';
import { CurrentUserProvider } from '../shared/providers/current-user.provider';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private currentUserProvider: CurrentUserProvider
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.currentUserProvider.getCurrentUser()) {
      return true;
    }

    this.router.navigate([ AuthRoutesPath.PATH_TO_LOGIN ], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
