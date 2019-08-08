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

  let expectPage: Page;

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

    expectPage = new Page();
    expectPage.pageSize = 3;
    expectPage.page = 2;
    expectPage.count = 20;
    expectPage.rows = [
      { id: '1', name: 'NAME1', email: 'EMAIL1' },
      { id: '2', name: 'NAME2', email: 'EMAIL2' },
      { id: '3', name: 'NAME3', email: 'EMAIL3' },
    ];

    spyOn(usersService, 'getUsers').and.returnValue(of(expectPage));

    component.loadData(2);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('load user', () => {
    expect(component.users).toEqual(expectPage.rows);
  });

  it('current page', () => {
    expect(component.currentPage).toBe(2);
  });

  it('page size', () => {
    expect(component.pageSize).toBe(3);
  });

  it('total records', () => {
    expect(component.totalRecords).toBe(20);
  });

  /** TODO Добавить тест кейсы: смена страницы, фильтр по словам из searchService */

});
