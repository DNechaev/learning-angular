import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';
import { URL_API_SESSIONS } from '../../shared/consts';
import { User } from '../../shared/models';
import { Role } from '../../shared/enums';
import { StorageService } from '../../shared/services/storage.service';

class MockStorageService {

  private localStorageValue;
  private sessionStorageValue;

  setItem(key: string, data: any, long = false): void {
    this.removeItem(key);
    if (long) {
      this.localStorageValue = data;
    } else {
      this.sessionStorageValue = data;
    }
  }

  getItem(key: string): any {
    return this.localStorageValue ? this.localStorageValue : this.sessionStorageValue;
  }

  removeItem(key: string): void {
    this.localStorageValue = null;
    this.sessionStorageValue = null;
  }

}

describe('AuthenticationService: registration', () => {
  let injector: TestBed;
  let authenticationService: AuthenticationService;
  let storageService: StorageService;
  let httpMock: HttpTestingController;
  let expectedUser;
  let createdUser;

  function helperRegistrationUser(testUser: User): Promise<User> {
    return new Promise((resolve) => {

      authenticationService.registration('email', 'password', 'name').subscribe(user => {
        resolve(user);
      });

      httpMock.expectOne(r => r.url.match(URL_API_SESSIONS + '/registration') && r.method === 'POST')
        .flush(testUser);

    });
  }

  beforeEach(async () => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: StorageService, useClass: MockStorageService }
      ]
    });

    injector = getTestBed();
    authenticationService = injector.get(AuthenticationService);
    storageService = injector.get(StorageService);

    storageService.removeItem('TEST');

    httpMock = injector.get(HttpTestingController);

    expectedUser = {id: 1, name: 'User', ssid: 'TEST_SSID'};
    createdUser = await helperRegistrationUser(expectedUser);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('user is successfully created', () => {
    expect(createdUser).toEqual(expectedUser);
  });

  it('saves new user to storage', () => {
    expect(storageService.getItem('currentUser')).toEqual(expectedUser);
  });

});

describe('AuthenticationService: login',  () => {
  let injector: TestBed;
  let authenticationService: AuthenticationService;
  let storageService: StorageService;
  let httpMock: HttpTestingController;
  let expectedUser;
  let createdUser;

  function helperLoginUser(testUser: User, remember = true): Promise<User> {
    return new Promise((resolve) => {

      storageService.removeItem('currentUser');

      authenticationService.login('email', 'password', remember).subscribe(user => {
        resolve(user);
      });

      httpMock.expectOne(r => r.url.match(URL_API_SESSIONS + '/login') && r.method === 'POST')
        .flush(testUser);

    });
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: StorageService, useClass: MockStorageService }
      ]
    });

    injector = getTestBed();
    authenticationService = injector.get(AuthenticationService);
    storageService = injector.get(StorageService);
    storageService.removeItem('TEST');

    httpMock = injector.get(HttpTestingController);

    expectedUser = new User();
    expectedUser.id = 1;
    expectedUser.name = 'User';
    expectedUser.ssid = 'TEST_SSID';

    createdUser = await helperLoginUser(expectedUser);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('user is successfully logged',  () => {
    expect(createdUser).toEqual(expectedUser);
  });

  it('save logged user to storage',  () => {
    expect(storageService.getItem('TEST')).toEqual(expectedUser);
  });

  it('get current user', () => {
    expect(authenticationService.getCurrentUser()).toEqual(expectedUser);
  });

  it('get user token',  async () => {
    expect(authenticationService.getToken()).toBe(expectedUser.ssid);
  });

});

describe('AuthenticationService: logout', () => {
  let injector: TestBed;
  let authenticationService: AuthenticationService;
  let storageService: StorageService;
  let httpMock: HttpTestingController;
  let expectedUser;
  let createdUser;

  function helperLoginUser(testUser: User, remember = true): Promise<User> {
    return new Promise((resolve) => {

      storageService.removeItem('currentUser');

      authenticationService.login('email', 'password', remember).subscribe(user => {
        resolve(user);
      });

      httpMock.expectOne(r => r.url.match(URL_API_SESSIONS + '/login') && r.method === 'POST')
        .flush(testUser);

    });
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: StorageService, useClass: MockStorageService }
      ]
    });

    injector = getTestBed();
    authenticationService = injector.get(AuthenticationService);
    storageService = injector.get(StorageService);
    storageService.removeItem('TEST');

    httpMock = injector.get(HttpTestingController);

    expectedUser = new User();
    expectedUser.id = 1;
    expectedUser.name = 'User';
    expectedUser.ssid = 'TEST_SSID';

    createdUser = await helperLoginUser(expectedUser);
  });

  it('user is successfully logout', async () => {
    await authenticationService.logout();
    expect(authenticationService.getCurrentUser()).toBeNull();
  });

  it('remove logout user from storage', async () => {
    await authenticationService.logout();
    expect(storageService.getItem('TEST')).toBeNull();
  });

});

describe('AuthenticationService: roles', () => {
  let injector: TestBed;
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: StorageService, useClass: MockStorageService }
      ]
    });

    injector = getTestBed();
    authenticationService = injector.get(AuthenticationService);
  });

  it('access by roles', () => {
    const user = new User();

    [
      { userRoles: [], testRoles: [], result: false},
      { userRoles: [], testRoles: [Role.ADMIN], result: false},
      { userRoles: [], testRoles: [Role.MANAGER], result: false},
      { userRoles: [], testRoles: [Role.USER], result: false},
      { userRoles: [], testRoles: [Role.ADMIN, Role.MANAGER], result: false},
      { userRoles: [], testRoles: [Role.ADMIN, Role.USER], result: false},
      { userRoles: [], testRoles: [Role.MANAGER, Role.USER], result: false},
      { userRoles: [], testRoles: [Role.ADMIN, Role.MANAGER, Role.USER], result: false},

      { userRoles: [Role.ADMIN], testRoles: [], result: false},
      { userRoles: [Role.ADMIN], testRoles: [Role.ADMIN], result: true},
      { userRoles: [Role.ADMIN], testRoles: [Role.MANAGER], result: false},
      { userRoles: [Role.ADMIN], testRoles: [Role.USER], result: false},
      { userRoles: [Role.ADMIN], testRoles: [Role.ADMIN, Role.MANAGER], result: true},
      { userRoles: [Role.ADMIN], testRoles: [Role.ADMIN, Role.USER], result: true},
      { userRoles: [Role.ADMIN], testRoles: [Role.MANAGER, Role.USER], result: false},
      { userRoles: [Role.ADMIN], testRoles: [Role.ADMIN, Role.MANAGER, Role.USER], result: true},

      { userRoles: [Role.ADMIN, Role.MANAGER], testRoles: [], result: false},
      { userRoles: [Role.ADMIN, Role.MANAGER], testRoles: [Role.ADMIN], result: true},
      { userRoles: [Role.ADMIN, Role.MANAGER], testRoles: [Role.MANAGER], result: true},
      { userRoles: [Role.ADMIN, Role.MANAGER], testRoles: [Role.USER], result: false},
      { userRoles: [Role.ADMIN, Role.MANAGER], testRoles: [Role.ADMIN, Role.MANAGER], result: true},
      { userRoles: [Role.ADMIN, Role.MANAGER], testRoles: [Role.ADMIN, Role.USER], result: true},
      { userRoles: [Role.ADMIN, Role.MANAGER], testRoles: [Role.MANAGER, Role.USER], result: true},
      { userRoles: [Role.ADMIN, Role.MANAGER], testRoles: [Role.ADMIN, Role.MANAGER, Role.USER], result: true},

      { userRoles: [Role.ADMIN, Role.MANAGER, Role.USER], testRoles: [], result: false},
      { userRoles: [Role.ADMIN, Role.MANAGER, Role.USER], testRoles: [Role.ADMIN], result: true},
      { userRoles: [Role.ADMIN, Role.MANAGER, Role.USER], testRoles: [Role.MANAGER], result: true},
      { userRoles: [Role.ADMIN, Role.MANAGER, Role.USER], testRoles: [Role.USER], result: true},
      { userRoles: [Role.ADMIN, Role.MANAGER, Role.USER], testRoles: [Role.ADMIN, Role.MANAGER], result: true},
      { userRoles: [Role.ADMIN, Role.MANAGER, Role.USER], testRoles: [Role.ADMIN, Role.USER], result: true},
      { userRoles: [Role.ADMIN, Role.MANAGER, Role.USER], testRoles: [Role.MANAGER, Role.USER], result: true},
      { userRoles: [Role.ADMIN, Role.MANAGER, Role.USER], testRoles: [Role.ADMIN, Role.MANAGER, Role.USER], result: true},

    ].forEach((test, index) => {
      user.roles = test.userRoles.map((v) => ({name: v}));
      expect(authenticationService.userHasRoles(user, test.testRoles)).toBe(test.result, 'Rules: ' + index );
    });

  });

});

describe('AuthenticationService: AuthenticationService', () => {
  let injector: TestBed;
  let service: AuthenticationService;
  let storageService: StorageService;
  let httpMock: HttpTestingController;
/*
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
*/
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: StorageService, useClass: MockStorageService }
      ]
    });
    injector = getTestBed();
    service = injector.get(AuthenticationService);
    storageService = injector.get(StorageService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function helperLoginUser(testUser: User, remember = true): Promise<User> {
    return new Promise((resolve) => {

      storageService.removeItem('currentUser');

      service.login('email', 'password', remember).subscribe(user => {
        resolve(user);
      });

      httpMock.expectOne(r => r.url.match(URL_API_SESSIONS + '/login') && r.method === 'POST')
        .flush(testUser);

    });
  }

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

});
