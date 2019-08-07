import {getTestBed, TestBed} from '@angular/core/testing';

import { UsersResolverService } from './users-resolver.service';
import { UsersService } from './users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../shared/models';

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
    const returnUser = new User();
    returnUser.id = 1;
    returnUser.name = 'User';

    service.getUserById(1).subscribe(user => {
      expect(user).toEqual(returnUser);
    });

    httpMock.expectOne(r => r.url.match('/api/users/1') && r.method === 'GET')
      .flush(returnUser);
  });

});
