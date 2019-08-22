import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CurrentUserProvider } from './current-user.provider';
import { User } from '../../core/user.model';
import { StorageService } from '../services/storage.service';
import { URL_API_SESSIONS } from '../../core/consts';

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

describe('CurrentUserProvider (preload profile with good ssid) ', () => {
  let injector: TestBed;
  let currentUserProvider: CurrentUserProvider;
  let storageService: StorageService;
  let httpMock: HttpTestingController;
  let expectedUser;
  let createdUser;

  function helperLoadCurrentUser(testUser: User): Promise<User> {
    return new Promise((resolve) => {
      currentUserProvider.loadCurrentUser().then(() => {
        resolve(currentUserProvider.getCurrentUser());
      });
      httpMock.expectOne(r => r.url.match(URL_API_SESSIONS + '/profile') && r.method === 'GET')
        .flush(testUser);
    });
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: StorageService, useClass: MockStorageService }
      ]
    });

    injector = getTestBed();
    currentUserProvider = injector.get(CurrentUserProvider);
    storageService = injector.get(StorageService);
    httpMock = injector.get(HttpTestingController);

    storageService.setItem('SSID', 'TEST_SSID_BEFORE');
    expectedUser = {id: 1, name: 'User', ssid: 'TEST_SSID_AFTER'};
    createdUser = await helperLoadCurrentUser(expectedUser);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('user is successfully loaded', () => {
    expect(createdUser).toEqual(expectedUser);
  });

  it('saves new ssid to storage', () => {
    expect(storageService.getItem('SSID')).toEqual(expectedUser.ssid);
  });

});

describe('CurrentUserProvider (preload profile without ssid) ', () => {
  let injector: TestBed;
  let currentUserProvider: CurrentUserProvider;
  let storageService: StorageService;
  let httpMock: HttpTestingController;
  let expectedUser;
  let createdUser;

  function helperLoadCurrentUser(testUser: User): Promise<User> {
    return new Promise((resolve) => {
      currentUserProvider.loadCurrentUser().then(() => {
        resolve(currentUserProvider.getCurrentUser());
      });
      httpMock.expectNone(r => r.url.match(URL_API_SESSIONS + '/profile') && r.method === 'GET');
    });
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: StorageService, useClass: MockStorageService }
      ]
    });

    injector = getTestBed();
    currentUserProvider = injector.get(CurrentUserProvider);
    storageService = injector.get(StorageService);
    httpMock = injector.get(HttpTestingController);

    storageService.removeItem('SSID');
    expectedUser = {id: 1, name: 'User', ssid: 'TEST_SSID_AFTER'};
    createdUser = await helperLoadCurrentUser(expectedUser);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('user isn\'t successfully loaded', () => {
    expect(createdUser).toBeNull();
  });

  it('saves empty ssid to storage', () => {
    expect(storageService.getItem('currentUser')).toBeNull();
  });

});

describe('CurrentUserProvider (preload profile with bad ssid) ', () => {
  let injector: TestBed;
  let currentUserProvider: CurrentUserProvider;
  let storageService: StorageService;
  let httpMock: HttpTestingController;
  let expectedUser;
  let createdUser;

  function helperLoadCurrentUser(testUser: User): Promise<User> {
    return new Promise((resolve) => {
      currentUserProvider.loadCurrentUser().then(() => {
        resolve(currentUserProvider.getCurrentUser());
      });
      const mockErrorResponse = { status: 403, statusText: 'Forbidden' };
      httpMock.expectOne(r => r.url.match(URL_API_SESSIONS + '/profile') && r.method === 'GET')
        .flush('Forbidden', mockErrorResponse);
    });
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: StorageService, useClass: MockStorageService }
      ]
    });

    injector = getTestBed();
    currentUserProvider = injector.get(CurrentUserProvider);
    storageService = injector.get(StorageService);
    httpMock = injector.get(HttpTestingController);

    storageService.setItem('SSID', 'TEST_SSID_BEFORE');
    expectedUser = {id: 1, name: 'User', ssid: 'TEST_SSID_AFTER'};
    createdUser = await helperLoadCurrentUser(expectedUser);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('user isn\'t successfully loaded', () => {
    expect(createdUser).toBeNull();
  });

  it('saves empty ssid to storage', () => {
    expect(storageService.getItem('currentUser')).toBeNull();
  });

});

describe('CurrentUserProvider (set user) ', () => {
  let injector: TestBed;
  let currentUserProvider: CurrentUserProvider;
  let storageService: StorageService;
  let expectedUser;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: StorageService, useClass: MockStorageService }
      ]
    });

    injector = getTestBed();
    currentUserProvider = injector.get(CurrentUserProvider);
    storageService = injector.get(StorageService);

    expectedUser = {id: 1, name: 'User', ssid: 'TEST_SSID_AFTER'};
    currentUserProvider.setCurrentUser(expectedUser);

  });

  it('user is successfully setted', () => {
    expect(currentUserProvider.getCurrentUser()).toEqual(expectedUser);
  });


  it('subscribe on user changes',  async () => {

    let testUser: User;

    currentUserProvider.currentUser$.subscribe(u => {
      testUser = u;
    });

    // -----------------------------
    expect(testUser).toEqual(expectedUser);

    // -----------------------------
    const returnUser1 = new User(1, 'User1', 'email1@test.com', '123456', [], 'TEST_SSID1');
    await currentUserProvider.setCurrentUser(returnUser1);
    expect(testUser).toEqual(returnUser1);

    // -----------------------------
    const returnUser2 = new User(2, 'User2', 'email2@test.com', '123456', [], 'TEST_SSID2');
    await currentUserProvider.setCurrentUser(returnUser2);
    expect(testUser).toEqual(returnUser2);

  });

});


