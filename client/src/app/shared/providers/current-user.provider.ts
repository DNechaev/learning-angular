import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { User} from '../models';
import { StorageService } from '../services/storage.service';
import { URL_API_SESSIONS } from '../consts';
import { Role } from '../enums';

export function CurrentUserProviderFactory(provider: CurrentUserProvider) {
  return () => provider.loadCurrentUser();
}

@Injectable({ providedIn: 'root' })
export class CurrentUserProvider {

  private storageKey = 'SSID';
  currentUser$: BehaviorSubject<User>;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {
    this.currentUser$ = new BehaviorSubject<User>(null);
  }

  public getCurrentUser(): User {
    return this.currentUser$.value;
  }

  getToken(): string {
    const key = this.storageService.getItem(this.storageKey);
    return key ? key : '';
  }

  loadCurrentUser(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.getToken() === '') {
        this.removeCurrentUser();
        resolve(true);
      } else {
        this.http.get<User>(URL_API_SESSIONS + '/profile')
          .subscribe(
            user => {
              this.setCurrentUser(user);
              resolve(true);
            },
            error => {
              this.removeCurrentUser();
              resolve(false);
            }
          );
      }
    });
  }

  setCurrentUser(user: User, remember: boolean = false) {
    const oldToken = this.storageService.getItem(this.storageKey);
    if (user.ssid !== oldToken) {
      this.storageService.setItem(this.storageKey, user.ssid, remember);
    }
    this.currentUser$.next(user);
    return user;
  }

  removeCurrentUser() {
    this.storageService.removeItem(this.storageKey);
    this.currentUser$.next(null);
  }

  userHasRoles(user: User, roles: Role[]): boolean {
    if (!user) { return false; }

    const userRoles = user.roles.map( v => v.name);

    let access = false;
    roles.forEach((element) => {
      if (userRoles.includes(element)) {
        access = true;
      }
    });

    return access;
  }

}
