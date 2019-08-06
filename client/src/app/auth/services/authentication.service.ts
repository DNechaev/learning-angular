import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '../../shared/models';
import { Role } from '../../shared/enums';
import { URL_API_SESSIONS } from '../../shared/consts';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private sessionId: string;
  private currentUserSubject$: BehaviorSubject<User>;

  currentUser$: Observable<User>;

  constructor(private http: HttpClient) {

    this.currentUserSubject$ = new BehaviorSubject<User>(JSON.parse(
      localStorage.getItem('currentUser') ? localStorage.getItem('currentUser') : sessionStorage.getItem('currentUser')
    ));
    this.currentUser$ = this.currentUserSubject$.asObservable();
  }

  get currentUserValue(): User {
    return this.currentUserSubject$.value;
  }

  getToken(): string {
    return (this.currentUserSubject$.value) ? this.currentUserSubject$.value.ssid : '';
  }

  login(email: string, password: string, remember: boolean = false): Observable<any> {
    return this.http.post<any>(URL_API_SESSIONS + '/login', { email, password })
      .pipe(
        // retry(3),
        map(user => this.applyCurrentUser(user, remember))
      );
  }

  logout() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
    this.sessionId = null;
    this.currentUserSubject$.next(null);
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
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');

    if (remember) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }

    this.sessionId = user.ssid;
    this.currentUserSubject$.next(user);
    return user;
  }

}
