import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '../../shared/models';
import { Role } from '../../shared/enums';
import { URL_API_SESSIONS } from '../../shared/consts';
import { CurrentUserProvider } from '../../shared/providers/current-user.provider';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private currentUserProvider: CurrentUserProvider
  ) {}

  registration(email: string, password: string, name: string): Observable<any> {
    return this.http.post<any>(URL_API_SESSIONS + '/registration', { email, password, name })
      .pipe(
        map(user => this.currentUserProvider.setCurrentUser(user))
      );
  }

  login(email: string, password: string, remember: boolean = false): Observable<any> {
    return this.http.post<any>(URL_API_SESSIONS + '/login', { email, password })
      .pipe(
        // retry(3),
        map(user => this.currentUserProvider.setCurrentUser(user, remember))
      );
  }

  logout() {
    this.currentUserProvider.removeCurrentUser();
  }

}
