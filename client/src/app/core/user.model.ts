import { Injectable } from '@angular/core';

import { Adapter } from './adapter';

export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public roles: Array<any>,
    public ssid?: string
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class UserAdapter implements Adapter<User> {

  input(item: any): User {
    return new User(
      item.id,
      item.name,
      item.email,
      item.password,
      item.roles,
      item.ssid
    );
  }

  output(item: User): any {
    return {
      id: item.id,
      name: item.name,
      email: item.email,
      password: item.password,
      roles: item.roles
    };
  }

}
