import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { EventsListComponent } from './events-list.component';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { EventsService } from '../events.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { SharedModule } from '../../shared/shared.module';
import { Page } from '../../core/page.model';

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;

  let authenticationService: AuthenticationService;
  let eventsService: EventsService;
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
        SharedModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgbPaginationModule
      ],
      declarations: [ EventsListComponent ],
      providers: [
        AuthenticationService,
        EventsService,
        LoaderIndicatorService,
        SearchService,
        ToastService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;

    authenticationService = fixture.debugElement.injector.get(AuthenticationService);
    eventsService = fixture.debugElement.injector.get(EventsService);
    loaderIndicatorService = fixture.debugElement.injector.get(LoaderIndicatorService);
    searchService = fixture.debugElement.injector.get(SearchService);
    toastService = fixture.debugElement.injector.get(ToastService);

    expectPage1 = new Page();
    expectPage1.pageSize = 3;
    expectPage1.page = 1;
    expectPage1.count = 5;
    expectPage1.rows = [
      { id: 1, name: 'EVENT1', dateBegin: '2019-01-01T10:00:00.000Z', dateEnd: '2019-01-01T12:00:00.000Z',  price: 100, ticketsCount: 10 },
      { id: 2, name: 'EVENT2', dateBegin: '2019-01-02T10:00:00.000Z', dateEnd: '2019-01-02T12:00:00.000Z',  price: 110, ticketsCount: 20 },
      { id: 3, name: 'EVENT3', dateBegin: '2019-01-03T10:00:00.000Z', dateEnd: '2019-01-03T12:00:00.000Z',  price: 120, ticketsCount: 30 },
    ];

    expectPage2 = new Page();
    expectPage2.pageSize = 3;
    expectPage2.page = 2;
    expectPage2.count = 5;
    expectPage2.rows = [
      { id: 4, name: 'EVENT4', dateBegin: '2019-01-04T10:00:00.000Z', dateEnd: '2019-01-04T12:00:00.000Z',  price: 140, ticketsCount: 40 },
      { id: 5, name: 'EVENT5', dateBegin: '2019-01-05T10:00:00.000Z', dateEnd: '2019-01-05T12:00:00.000Z',  price: 150, ticketsCount: 50 },
    ];

    expectPage3 = new Page();
    expectPage3.pageSize = 3;
    expectPage3.page = 1;
    expectPage3.count = 1;
    expectPage3.rows = [
      { id: 6, name: 'test', dateBegin: '2019-01-06T10:00:00.000Z', dateEnd: '2019-01-06T12:00:00.000Z',  price: 160, ticketsCount: 60 },
    ];

    spyOn(eventsService, 'getEvents')
      .withArgs(
        { name: null, dateBeginFrom: null, dateBeginTo: null, dateEndFrom: null, dateEndTo: null, filter: '' }, 1, 3
      ).and.returnValue(of(expectPage1))
      .withArgs(
        { name: null, dateBeginFrom: null, dateBeginTo: null, dateEndFrom: null, dateEndTo: null, filter: '' }, 2, 3
      ).and.returnValue(of(expectPage2))
      .withArgs(
        { name: null, dateBeginFrom: null, dateBeginTo: null, dateEndFrom: null, dateEndTo: null, filter: 'test' }, 1, 3
      ).and.returnValue(of(expectPage3));

    component.pageSize = 3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('load event page 1', () => {
    component.loadData(1);
    expect(component.events).toEqual(expectPage1.rows);
  });

  it('load event page 2', () => {
    component.loadData(2);
    expect(component.events).toEqual(expectPage2.rows);
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

  it('get events by searchService subscription', () => {
    searchService.set('test');
    expect(component.events).toEqual(expectPage3.rows);
  });

});
