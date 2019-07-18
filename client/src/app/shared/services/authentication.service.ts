import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map, catchError, retry} from 'rxjs/operators';
import {User} from '../models/user.model';
import {Role} from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private sessionId: string;
  private currentUserSubject: BehaviorSubject<User>;

  public  currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public getToken() {
    return (this.currentUserSubject.value) ? this.currentUserSubject.value.ssid : '';
  }

  public login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/session/login`, { email, password })
      .pipe(
        retry(3),
        map(user => {
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.sessionId = user.ssid;
          this.currentUserSubject.next(user);
          return user;
        }),
        // catchError(this.handleError)
      );
  }

  public logout() {
    sessionStorage.removeItem('currentUser');
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
        }),
        // catchError(this.handleError)
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

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error('Backend returned code', error);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

}
