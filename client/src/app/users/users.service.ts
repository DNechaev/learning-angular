import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Page } from '../shared/models/page.model';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl: string = environment.apiUrl + '/api/users';

  constructor(private http: HttpClient) {}

  getUsers( filter: string, page: number, pageSize: number ): Observable<Page> {
    const params = new HttpParams()
      .set('filter', filter)
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    return this.http.get<Page>(this.baseUrl, { params } );
  }

  getUserById( userId: number ): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + userId );
  }

  createUser( user: User ): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  updateUser( userId: number, user: User): Observable<User> {
    return this.http.put<User>(this.baseUrl + '/' + userId, user);
  }

  public deleteUser( userId: number ): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + userId);
  }

}
