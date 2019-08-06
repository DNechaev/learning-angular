import {getTestBed, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {AuthenticationService} from './authentication.service';
import {URL_API_SESSIONS} from '../../shared/consts';
import {User} from '../../shared/models';
import {Role} from '../../shared/enums';

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

  function helperLoginUser(testUser: User, remember = true): Promise<User> {
    return new Promise((resolve) => {

      sessionStorage.removeItem('currentUser');
      localStorage.removeItem('currentUser');

      service.login('email', 'password', remember).subscribe(user => {
        resolve(user);
      });

      httpMock.expectOne(r => r.url.match(URL_API_SESSIONS + '/login') && r.method === 'POST')
        .flush(testUser);

    });
  }

  function helperRegistrationUser(testUser: User): Promise<User> {
    return new Promise((resolve) => {

      sessionStorage.removeItem('currentUser');
      localStorage.removeItem('currentUser');

      service.registration('email', 'password', 'name').subscribe(user => {
        resolve(user);
      });

      httpMock.expectOne(r => r.url.match(URL_API_SESSIONS + '/registration') && r.method === 'POST')
        .flush(testUser);

    });
  }

  it('registration user', async () => {
    const returnUser = new User();
    returnUser.id = 1;
    returnUser.name = 'User';
    returnUser.ssid = 'TEST_SSID';

    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');

    const user = await helperRegistrationUser(returnUser);

    expect(user).toEqual(returnUser);
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(sessionStorage.getItem('currentUser')).toBeTruthy();
    expect(JSON.parse(sessionStorage.getItem('currentUser'))).toEqual(JSON.parse(JSON.stringify(returnUser)));

  });

  it('login with remember', async () => {
    const returnUser = new User();
    returnUser.id = 1;
    returnUser.name = 'User';
    returnUser.ssid = 'TEST_SSID';

    const user = await helperLoginUser(returnUser, true);

    expect(user).toEqual(returnUser);
    expect(sessionStorage.getItem('currentUser')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('currentUser'))).toEqual(JSON.parse(JSON.stringify(returnUser)));

  });

  it('login without remember', async () => {
    const returnUser = new User();
    returnUser.id = 1;
    returnUser.name = 'User';
    returnUser.ssid = 'TEST_SSID';

    const user = await helperLoginUser(returnUser, false);

    expect(user).toEqual(returnUser);
    expect(sessionStorage.getItem('currentUser')).toBeTruthy();
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(JSON.parse(sessionStorage.getItem('currentUser'))).toEqual(JSON.parse(JSON.stringify(returnUser)));

  });

  it('logout', async () => {
    const returnUser = new User();
    returnUser.id = 1;
    returnUser.name = 'User';
    returnUser.ssid = 'TEST_SSID';

    const user = await helperLoginUser(returnUser, true);
    expect(user).toEqual(returnUser);

    await service.logout();

    expect(sessionStorage.getItem('currentUser')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(service.currentUserValue).toBeNull();
  });

  it('get current user',  async () => {

    const returnUser = new User();
    returnUser.id = 1;
    returnUser.name = 'User';
    returnUser.ssid = 'TEST_SSID';

    const user = await helperLoginUser(returnUser, false);

    expect(user).toEqual(returnUser);
    expect(service.currentUserValue).toEqual(returnUser);

  });

  it('get user token',  async () => {

    const returnUser = new User();
    returnUser.id = 1;
    returnUser.name = 'User';
    returnUser.ssid = 'TEST_SSID';

    const user = await helperLoginUser(returnUser, false);

    expect(user).toEqual(returnUser);
    expect(service.getToken()).toBe(returnUser.ssid);

  });

  it('subscribe on user changes',  async () => {

    let testUser: User;

    service.currentUser$.subscribe(u => {
      testUser = u;
    });

    // -----------------------------
    const returnUser1 = new User();
    returnUser1.id = 1;
    returnUser1.name = 'User1';
    returnUser1.ssid = 'TEST_SSID1';

    await helperLoginUser(returnUser1, false);
    expect(testUser).toEqual(returnUser1);

    // -----------------------------
    const returnUser2 = new User();
    returnUser2.id = 2;
    returnUser2.name = 'User2';
    returnUser2.ssid = 'TEST_SSID2';

    await helperLoginUser(returnUser2, false);
    expect(testUser).toEqual(returnUser2);

  });

  it('access by roles', () => {
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

});
