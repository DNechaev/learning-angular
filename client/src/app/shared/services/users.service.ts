import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
/*
  private apiUrl: string;
  private ssid: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }
  /*
  getAuthParams() {
    const headers = new  HttpHeaders().set('X-SSID', this.ssid);
    const params = new HttpParams().set('ssid', this.ssid);
    return {headers, params};
  }
* /
  public login(email: string, password: string) {
    //const params = new HttpParams().set('email', email).set('password', password);

    this.http.post(`/api/session/login`, JSON.stringify({email, password}))
      .subscribe(
        data => {
          console.log('POST Request is successful ', data);
        },
        error => {
          console.log('Error', error);
        }
      );
  }

    /*getUserByEmail(email: string): Observable<User> {

      return this.http. .get(`http://localhost:8120/api/users?email=${email}&ssid=ssid_admin`, this.getAuthParams())
        .map( (response: Response) => response.json() );
        //.map( (user: User) => console.log(user) )
    }*/

}
