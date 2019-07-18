import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {User} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private sessionId: string;
  private currentUserSubject: BehaviorSubject<User>;

  public  currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/session/login`, { email, password })
      .pipe(map(user => {
        this.sessionId = user.ssid;
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    this.sessionId = null;
    this.currentUserSubject.next(null);
  }

  registration(email: string, password: string, name: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/session/registration`, { email, password, name })
      .pipe(map(user => {
        this.sessionId = user.ssid;
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  checkAccess(user: User, roles: string[] = []) {

    if (!user) { return false; }

    console.log();
/*
    let userRoles = user['roles'].map( v => v.name);

    //console.log('checkAccess', userRoles);

    let access = false;
    roles.forEach(function(element) {
      if (userRoles.indexOf(element) != -1) {
        access = true;
      }
    });

    return access;*/
  }

}
