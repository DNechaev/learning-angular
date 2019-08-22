import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { URL_API_SESSIONS } from '../../core/consts';
import { CurrentUserProvider } from '../../shared/providers/current-user.provider';
import { UserAdapter } from '../../core/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private currentUserProvider: CurrentUserProvider,
    private adapter: UserAdapter
  ) {}

  registration(email: string, password: string, name: string): Observable<any> {
    return this.http.post<any>(URL_API_SESSIONS + '/registration', { email, password, name })
      .pipe(
        map(u => {
          const user = this.adapter.input(u);
          this.currentUserProvider.setCurrentUser(user);
          return user;
        })
      );
  }

  login(email: string, password: string, remember: boolean = false): Observable<any> {
    return this.http.post<any>(URL_API_SESSIONS + '/login', { email, password })
      .pipe(
        map(u => {
          const user = this.adapter.input(u);
          this.currentUserProvider.setCurrentUser(user, remember);
          return user;
        })
      );
  }

  logout() {
    this.currentUserProvider.removeCurrentUser();
  }

}
