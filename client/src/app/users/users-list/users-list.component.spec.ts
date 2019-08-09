import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { UsersListComponent } from './users-list.component';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { UsersService } from '../users.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { Page } from 'src/app/shared/models';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;

  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  let loaderIndicatorService: LoaderIndicatorService;
  let searchService: SearchService;
  let toastService: ToastService;
  let expectPage1: Page;
  let expectPage2: Page;
  let expectPage3: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ReactiveFormsModule,
        NgbPaginationModule
      ],
      declarations: [ UsersListComponent ],
      providers: [
        AuthenticationService,
        UsersService,
        LoaderIndicatorService,
        SearchService,
        ToastService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;

    authenticationService = fixture.debugElement.injector.get(AuthenticationService);
    usersService = fixture.debugElement.injector.get(UsersService);
    loaderIndicatorService = fixture.debugElement.injector.get(LoaderIndicatorService);
    searchService = fixture.debugElement.injector.get(SearchService);
    toastService = fixture.debugElement.injector.get(ToastService);

    expectPage1 = new Page();
    expectPage1.pageSize = 3;
    expectPage1.page = 1;
    expectPage1.count = 5;
    expectPage1.rows = [
      { id: '1', name: 'NAME1', email: 'EMAIL1' },
      { id: '2', name: 'NAME2', email: 'EMAIL2' },
      { id: '3', name: 'NAME3', email: 'EMAIL3' },
    ];

    expectPage2 = new Page();
    expectPage2.pageSize = 3;
    expectPage2.page = 2;
    expectPage2.count = 5;
    expectPage2.rows = [
      { id: '4', name: 'NAME4', email: 'EMAIL4' },
      { id: '5', name: 'NAME5', email: 'EMAIL5' },
    ];

    expectPage3 = new Page();
    expectPage3.pageSize = 3;
    expectPage3.page = 1;
    expectPage3.count = 1;
    expectPage3.rows = [
      { id: '20', name: 'test', email: 'EMAIL' },
    ];

    spyOn(usersService, 'getUsers')
      .withArgs('', 1, 3).and.returnValue(of(expectPage1))
      .withArgs('', 2, 3).and.returnValue(of(expectPage2))
      .withArgs('test', 1, 3).and.returnValue(of(expectPage3));

    component.pageSize = 3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('load user page 1', () => {
    component.loadData(1);
    expect(component.users).toEqual(expectPage1.rows);
  });

  it('load user page 2', () => {
    component.loadData(2);
    expect(component.users).toEqual(expectPage2.rows);
  });

  it('current page 1', () => {
    component.loadData(1);
    expect(component.currentPage).toBe(1);
  });

  it('current page 2', () => {
    component.loadData(2);
    expect(component.currentPage).toBe(2);
  });

  it('page size', () => {
    component.loadData(1);
    expect(component.pageSize).toBe(3);
  });

  it('total records', () => {
    component.loadData(2);
    expect(component.totalRecords).toBe(5);
  });

  it('get users by searchService subscription', () => {
    searchService.set('test');
    expect(component.users).toEqual(expectPage3.rows);
  });

});
