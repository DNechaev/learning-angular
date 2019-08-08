import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, EMPTY } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { take, mergeMap } from 'rxjs/operators';

import { User } from '../shared/models';
import { UsersRoutesPath } from './users.routing';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class UsersResolverService implements Resolve<User> {

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Observable<never> {

    if (!route.paramMap.has('id')) {
      this.router.navigate([UsersRoutesPath.PATH_TO_LIST]);
      return EMPTY;
    }

    const id = route.paramMap.get('id');

    return this.usersService.getUserById(+id).pipe(
      take(1),
      mergeMap(user => {
        if (user) {
          return of(user);
        } else { // id not found
          this.router.navigate([UsersRoutesPath.PATH_TO_LIST]);
          return EMPTY;
        }
      })
    );
  }

}
