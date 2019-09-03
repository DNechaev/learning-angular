import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UsersService } from './users.service';
import { User, UserAdapter } from '../core/user.model';
import { URL_API_USERS } from '../core/consts';

describe('UsersService', () => {
  let injector: TestBed;
  let service: UsersService;
  let httpMock: HttpTestingController;
  const adapter: UserAdapter = new UserAdapter();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ UsersService ]
    });
    injector = getTestBed();
    service = injector.get(UsersService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('get user by id', () => {
    const serverUser = {
      id: 1,
      name: 'User',
      email: 'email',
      password: 'password',
      role: [],
      ssid: 'ssid'
    };
    const expectUser = adapter.input(serverUser);

    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(expectUser);
    });

    httpMock.expectOne(r => r.url.match( URL_API_USERS + '/1') && r.method === 'GET')
      .flush(serverUser);
  });

  it('get user by id (error test)', () => {
    const mockErrorResponse = { status: 404, statusText: 'Not found' };
    const data = {message: 'Invalid request parameters'};

    service.getUserById(1).subscribe(user => {
      expect(true).toBe(false);
    }, err => {
      expect(err.error).toEqual(data);
    });

    httpMock.expectOne(r => r.url.match( URL_API_USERS + '/1') && r.method === 'GET')
      .flush(data, mockErrorResponse);
  });

  it('get users', () => {
    const serverUser1 = {
      id: 1,
      name: 'User1',
      email: 'email1',
      password: 'password1',
      role: [],
      ssid: 'ssid1'
    };
    const expectUser1 = adapter.input(serverUser1);

    const serverUser2 = {
      id: 2,
      name: 'User2',
      email: 'email2',
      password: 'password2',
      role: [],
      ssid: 'ssid2'
    };
    const expectUser2 = adapter.input(serverUser2);

    const serverPage = {
      count: 17,
      pageSize: 15,
      page: 2,
      rows: [
        serverUser1,
        serverUser2
      ]
    };

    const expectPage = {
      count: 17,
      pageSize: 15,
      page: 2,
      rows: [
        expectUser1,
        expectUser2
      ]
    };

    service.getUsers({filter: 'FilterString'}, {}, 2, 15).subscribe(page => {
      expect(page).toEqual(expectPage);
    });

    const req = httpMock.expectOne(r => r.url.match( URL_API_USERS ) && r.method === 'GET');
    expect(req.request.params.get('filter')).toBe('FilterString');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('15');
    req.flush(serverPage);
  });

  it('create user', () => {
    const sendUser = new User(1, 'User', 'email', 'password', [], 'ssid');
    const serverUser = {
      id: 1,
      name: 'User',
      email: 'email',
      password: 'password',
      role: [],
      ssid: 'ssid'
    };
    const expectUser = adapter.input(serverUser);

    service.createUser(sendUser).subscribe(returnUser => {
      expect(returnUser).toEqual(expectUser);
    });

    httpMock.expectOne(r => r.url.match( URL_API_USERS ) && r.method === 'POST')
      .flush(serverUser);
  });

  it('update user', () => {
    const sendUser = new User(1, 'User', 'email', 'password', [], 'ssid');
    const serverUser = {
      id: 1,
      name: 'User',
      email: 'email',
      password: 'password',
      role: [],
      ssid: 'ssid'
    };
    const expectedUser = adapter.input(serverUser);

    service.updateUser(10, sendUser).subscribe(returnUser => {
      expect(returnUser).toEqual(expectedUser);
    });

    httpMock.expectOne(r => r.url.match(URL_API_USERS + '/10') && r.method === 'PUT')
      .flush(serverUser);
  });

  it('delete user', () => {
    service.deleteUser(10).subscribe(ans => {
      expect(ans).toEqual({});
    });

    httpMock.expectOne(r => r.url.match(URL_API_USERS + '/10') && r.method === 'DELETE')
      .flush({});
  });

});


