import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UsersService } from './users.service';
import { User } from '../shared/models';

describe('UsersService', () => {
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

  it('#getUserById: Observable<User>', () => {
    const returnUser = new User();
    returnUser.id = 1;
    returnUser.name = 'User1';

    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(returnUser);
    });

    httpMock.expectOne(r => r.url.match('/api/users/1') && r.method === 'GET')
      .flush(returnUser);
  });

  it('#getUserById: Observable<Error>', () => {
    const mockErrorResponse = { status: 404, statusText: 'Not found' };
    const data = {message: 'Invalid request parameters'};

    service.getUserById(1).subscribe(user => {
      expect(true).toBe(false);
    }, err => {
      expect(err.error).toEqual(data);
    });

    httpMock.expectOne(r => r.url.match('/api/users/1') && r.method === 'GET')
      .flush(data, mockErrorResponse);
  });

  it('#getUsers: Observable<Page>', () => {
    const returnPage = {
      count: 17,
      pageSize: 15,
      page: 2,
      rows: [
        {
          id: 1,
          name: 'User1'
        }, {
          id: 2,
          name: 'User2'
        }
      ]
    };

    service.getUsers('FilterString', 2, 15).subscribe(page => {
      expect(page).toEqual(returnPage);
    });

    const req = httpMock.expectOne(r => r.url.match('/api/users') && r.method === 'GET');
    expect(req.request.params.get('filter')).toBe('FilterString');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('15');
    req.flush(returnPage);
  });

  it('#createUser: Observable<User>', () => {
    const user = new User();
    user.id = 1;
    user.name = 'User1';

    service.createUser(user).subscribe(returnUser => {
      expect(user).toEqual(returnUser);
    });

    httpMock.expectOne(r => r.url.match('/api/users') && r.method === 'POST')
      .flush(user);
  });

  it('#updateUser: Observable<User>', () => {
    const user = new User();
    user.id = 1;
    user.name = 'User1';

    service.updateUser(10, user).subscribe(returnUser => {
      expect(user).toEqual(returnUser);
    });

    httpMock.expectOne(r => r.url.match('/api/users/10') && r.method === 'PUT')
      .flush(user);
  });

  it('#deleteUser: Observable<any>', () => {
    service.deleteUser(10).subscribe(ans => {
      expect(ans).toEqual({});
    });

    httpMock.expectOne(r => r.url.match('/api/users/10') && r.method === 'DELETE')
      .flush({});
  });

});


