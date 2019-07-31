import {getTestBed, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {AuthenticationService} from './authentication.service';
import {URL_API_SESSIONS} from '../consts';
import {User} from '../models';
import {Role} from '../enums';

describe('AuthenticationService', () => {
  let injector: TestBed;
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService]
    });
    injector = getTestBed();
    service = injector.get(AuthenticationService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('#login with remember', () => {
    const returnUser = new User();
    returnUser.id = 1;
    returnUser.name = 'User1';
    returnUser.ssid = 'TEST_SSID_1234567890';

    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');

    service.login('test@test.com', '123456', true).subscribe(user => {
      expect(user).toEqual(returnUser);
      expect(sessionStorage.getItem('currentUser')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeTruthy();
      expect(JSON.parse(localStorage.getItem('currentUser'))).toEqual(JSON.parse(JSON.stringify(returnUser)));
    });

    httpMock.expectOne(r => r.url.match(URL_API_SESSIONS + '/login') && r.method === 'POST')
      .flush(returnUser);
  });

  it('#login without remember', () => {
    const returnUser = new User();
    returnUser.id = 1;
    returnUser.name = 'User1';
    returnUser.ssid = 'TEST_SSID';

    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');

    service.login('test@test.com', '123456', false).subscribe(user => {
      expect(user).toEqual(returnUser);
      expect(sessionStorage.getItem('currentUser')).toBeTruthy();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(JSON.parse(sessionStorage.getItem('currentUser'))).toEqual(JSON.parse(JSON.stringify(returnUser)));
    });

    httpMock.expectOne(r => r.url.match(URL_API_SESSIONS + '/login') && r.method === 'POST')
      .flush(returnUser);
  });

  it('#userHasRoles', () => {
    const user = new User();

    // --------------------
    user.roles = [
      {name: Role.ADMIN},
      {name: Role.MANAGER},
      {name: Role.USER}
    ];

    expect(service.userHasRoles(user, [])).toBe(false);

    expect(service.userHasRoles(user, [Role.ADMIN])).toBe(true);
    expect(service.userHasRoles(user, [Role.MANAGER])).toBe(true);
    expect(service.userHasRoles(user, [Role.USER])).toBe(true);

    expect(service.userHasRoles(user, [Role.ADMIN, Role.MANAGER])).toBe(true);
    expect(service.userHasRoles(user, [Role.ADMIN, Role.USER])).toBe(true);
    expect(service.userHasRoles(user, [Role.MANAGER, Role.USER])).toBe(true);

    expect(service.userHasRoles(user, [Role.ADMIN, Role.MANAGER, Role.USER])).toBe(true);

    // --------------------
    user.roles = [];

    expect(service.userHasRoles(user, [])).toBe(false);

    expect(service.userHasRoles(user, [Role.ADMIN])).toBe(false);
    expect(service.userHasRoles(user, [Role.MANAGER])).toBe(false);
    expect(service.userHasRoles(user, [Role.USER])).toBe(false);

    expect(service.userHasRoles(user, [Role.ADMIN, Role.MANAGER])).toBe(false);
    expect(service.userHasRoles(user, [Role.ADMIN, Role.USER])).toBe(false);
    expect(service.userHasRoles(user, [Role.MANAGER, Role.USER])).toBe(false);

    expect(service.userHasRoles(user, [Role.ADMIN, Role.MANAGER, Role.USER])).toBe(false);

    // --------------------
    user.roles = [
      {name: Role.ADMIN},
    ];

    expect(service.userHasRoles(user, [])).toBe(false);

    expect(service.userHasRoles(user, [Role.ADMIN])).toBe(true);
    expect(service.userHasRoles(user, [Role.MANAGER])).toBe(false);
    expect(service.userHasRoles(user, [Role.USER])).toBe(false);

    expect(service.userHasRoles(user, [Role.ADMIN, Role.MANAGER])).toBe(true);
    expect(service.userHasRoles(user, [Role.ADMIN, Role.USER])).toBe(true);
    expect(service.userHasRoles(user, [Role.MANAGER, Role.USER])).toBe(false);

    expect(service.userHasRoles(user, [Role.ADMIN, Role.MANAGER, Role.USER])).toBe(true);

    // --------------------
    user.roles = [
      {name: Role.MANAGER},
    ];

    expect(service.userHasRoles(user, [])).toBe(false);

    expect(service.userHasRoles(user, [Role.ADMIN])).toBe(false);
    expect(service.userHasRoles(user, [Role.MANAGER])).toBe(true);
    expect(service.userHasRoles(user, [Role.USER])).toBe(false);

    expect(service.userHasRoles(user, [Role.ADMIN, Role.MANAGER])).toBe(true);
    expect(service.userHasRoles(user, [Role.ADMIN, Role.USER])).toBe(false);
    expect(service.userHasRoles(user, [Role.MANAGER, Role.USER])).toBe(true);

    expect(service.userHasRoles(user, [Role.ADMIN, Role.MANAGER, Role.USER])).toBe(true);

    // --------------------
    user.roles = [
      {name: Role.USER}
    ];

    expect(service.userHasRoles(user, [])).toBe(false);

    expect(service.userHasRoles(user, [Role.ADMIN])).toBe(false);
    expect(service.userHasRoles(user, [Role.MANAGER])).toBe(false);
    expect(service.userHasRoles(user, [Role.USER])).toBe(true);

    expect(service.userHasRoles(user, [Role.ADMIN, Role.MANAGER])).toBe(false);
    expect(service.userHasRoles(user, [Role.ADMIN, Role.USER])).toBe(true);
    expect(service.userHasRoles(user, [Role.MANAGER, Role.USER])).toBe(true);

    expect(service.userHasRoles(user, [Role.ADMIN, Role.MANAGER, Role.USER])).toBe(true);

  });

  /* TODO: Test other services methods */

});
