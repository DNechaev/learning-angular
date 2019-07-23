import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private sessionId: string;
  private currentUserSubject: BehaviorSubject<User>;

  public  currentUser: Observable<User>;

  constructor(private http: HttpClient) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(
      localStorage.getItem('currentUser') ? localStorage.getItem('currentUser') : sessionStorage.getItem('currentUser')
    ));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public getToken() {
    return (this.currentUserSubject.value) ? this.currentUserSubject.value.ssid : '';
  }

  public login(email: string, password: string, remember: boolean = false) {
    return this.http.post<any>(`${environment.apiUrl}/api/session/login`, { email, password })
      .pipe(
        retry(3),
        map(user => {
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          if (remember) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.sessionId = user.ssid;
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  public logout() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
    this.sessionId = null;
    this.currentUserSubject.next(null);
  }

  public registration(email: string, password: string, name: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/session/registration`, { email, password, name })
      .pipe(
        map(user => {
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.sessionId = user.ssid;
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  public checkAccess(user: User, roles?: string[]) {
    if (!user) { return false; }

    const userRoles = user.roles.map( v => v.name);

    let access = false;
    roles.forEach((element) => {
      if (userRoles.indexOf(element) !== -1) {
        access = true;
      }
    });

    return access;
  }

}
