import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';
import { URL_API_SESSIONS } from '../../shared/consts';
import { User } from '../../shared/models';
import { CurrentUserProvider } from '../../shared/providers/current-user.provider';

class MockCurrentUserProvider {

  private currentUser: User;
  private currentUserToken = '';

  public getCurrentUser(): User {
    return this.currentUser;
  }

  getToken(): string {
    return this.currentUserToken;
  }

  setCurrentUser(user: User, remember: boolean = false) {
    return this.currentUser = user;
  }

  removeCurrentUser() {
    this.currentUser = null;
    this.currentUserToken = '';
  }
}

describe('AuthenticationService (registration)', () => {
  let injector: TestBed;
  let authenticationService: AuthenticationService;
  let currentUserProvider: CurrentUserProvider;
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
        { provide: CurrentUserProvider, useClass: MockCurrentUserProvider }
      ]
    });

    injector = getTestBed();
    authenticationService = injector.get(AuthenticationService);
    currentUserProvider = injector.get(CurrentUserProvider);

    currentUserProvider.removeCurrentUser();

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
    expect(currentUserProvider.getCurrentUser()).toEqual(expectedUser);
  });

});

describe('AuthenticationService (login)',  () => {
  let injector: TestBed;
  let authenticationService: AuthenticationService;
  let currentUserProvider: CurrentUserProvider;
  let httpMock: HttpTestingController;
  let expectedUser;
  let createdUser;

  function helperLoginUser(testUser: User, remember = true): Promise<User> {
    return new Promise((resolve) => {

      currentUserProvider.removeCurrentUser();

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
        { provide: CurrentUserProvider, useClass: MockCurrentUserProvider }
      ]
    });

    injector = getTestBed();
    authenticationService = injector.get(AuthenticationService);
    currentUserProvider = injector.get(CurrentUserProvider);

    httpMock = injector.get(HttpTestingController);

    expectedUser = new User();
    expectedUser.id = 1;
    expectedUser.name = 'User';
    expectedUser.ssid = 'SSID';

    createdUser = await helperLoginUser(expectedUser);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('user is successfully logged',  () => {
    expect(createdUser).toEqual(expectedUser);
  });

  it('save logged user to storage',  () => {
    expect(currentUserProvider.getCurrentUser()).toEqual(expectedUser);
  });

});

describe('AuthenticationService (logout)', () => {
  let injector: TestBed;
  let authenticationService: AuthenticationService;
  let currentUserProvider: CurrentUserProvider;
  let httpMock: HttpTestingController;
  let expectedUser;
  let createdUser;

  function helperLoginUser(testUser: User, remember = true): Promise<User> {
    return new Promise((resolve) => {

      currentUserProvider.removeCurrentUser();

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
        { provide: CurrentUserProvider, useClass: MockCurrentUserProvider }
      ]
    });

    injector = getTestBed();
    authenticationService = injector.get(AuthenticationService);
    currentUserProvider = injector.get(CurrentUserProvider);
    currentUserProvider.removeCurrentUser();

    httpMock = injector.get(HttpTestingController);

    expectedUser = new User();
    expectedUser.id = 1;
    expectedUser.name = 'User';
    expectedUser.ssid = 'SSID';

    createdUser = await helperLoginUser(expectedUser);
  });

  it('user is successfully logout', async () => {
    await authenticationService.logout();
    expect(currentUserProvider.getCurrentUser()).toBeNull();
  });

  it('remove logout user from storage', async () => {
    await authenticationService.logout();
    expect(currentUserProvider.getToken()).toBe('');
  });

});

describe('AuthenticationService (AuthenticationService)', () => {
  let injector: TestBed;
  let service: AuthenticationService;
  let currentUserProvider: CurrentUserProvider;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: CurrentUserProvider, useClass: MockCurrentUserProvider }
      ]
    });
    injector = getTestBed();
    service = injector.get(AuthenticationService);
    currentUserProvider = injector.get(CurrentUserProvider);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function helperLoginUser(testUser: User, remember = true): Promise<User> {
    return new Promise((resolve) => {

      currentUserProvider.removeCurrentUser();

      service.login('email', 'password', remember).subscribe(user => {
        resolve(user);
      });

      httpMock.expectOne(r => r.url.match(URL_API_SESSIONS + '/login') && r.method === 'POST')
        .flush(testUser);

    });
  }

});
