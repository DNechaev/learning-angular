import {getTestBed, TestBed} from '@angular/core/testing';

import { UsersResolverService } from './users-resolver.service';
import { UsersService } from './users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../core/user.model';
import { URL_API_USERS } from '../core/consts';

describe('UsersResolverService', () => {
  let injector: TestBed;
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    });
    injector = getTestBed();
    service = injector.get(UsersService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get user by id', () => {
    const returnUser = new User(1, 'User', 'email', 'password', [], 'ssid');
    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(returnUser);
    });

    httpMock.expectOne(r => r.url.match(URL_API_USERS + '/1') && r.method === 'GET')
      .flush(returnUser);
  });

});
