import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '../../shared/models';
import { Role } from '../../shared/enums';
import { URL_API_SESSIONS } from '../../shared/consts';
import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private userKey = 'currentUser';

  currentUser$: BehaviorSubject<User>;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.currentUser$ = new BehaviorSubject<User>(storageService.getItem(this.userKey));
  }

  getCurrentUser(): User {
    return this.currentUser$.value;
  }

  getToken(): string {
    const user = this.getCurrentUser();
    return user ? user.ssid : '';
  }

  login(email: string, password: string, remember: boolean = false): Observable<any> {
    return this.http.post<any>(URL_API_SESSIONS + '/login', { email, password })
      .pipe(
        // retry(3),
        map(user => this.applyCurrentUser(user, remember))
      );
  }

  logout() {
    this.storageService.removeItem(this.userKey);
    this.currentUser$.next(null);
  }

  registration(email: string, password: string, name: string): Observable<any> {
    return this.http.post<any>(URL_API_SESSIONS + '/registration', { email, password, name })
      .pipe(
        map(user => this.applyCurrentUser(user))
      );
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

  private applyCurrentUser(user: User, remember: boolean = false) {
    this.storageService.setItem(this.userKey, user, remember);
    this.currentUser$.next(user);
    return user;
  }

}
