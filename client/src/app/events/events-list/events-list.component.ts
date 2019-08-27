import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Role } from '../../core/enums';
import { User } from '../../core/user.model';
import { Event } from '../../core/event.model';
import { EventsService } from '../events.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { EventsRoutesPath } from '../events.routing';
import { AppRoutesPath } from '../../app-routing.module';
import { CurrentUserProvider } from '../../shared/providers/current-user.provider';
import {
  GridActionEvent,
  GridColumn,
  GridFormatterEvent,
  GridHighlightMap
} from '../../shared/components/grid/grid.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { BaseListComponent } from '../../core/base-list.component';


@Component({
  selector: 'app-events',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
  providers: [ EventsService ]
})
export class EventsListComponent extends BaseListComponent implements OnInit, OnDestroy {

  private authorizedUser: User;

  subscriptions: Subscription[] = [];
  events: Event[];
  totalRecords = 0;
  currentPage  = 1;
  pageSize     = 10;

  access = false;
  accessUser = false;
  accessManager = false;

  isLoading    = false;
  isFilterCollapsed;
  filterForm: FormGroup;
  highlightMap: GridHighlightMap;

  urls = {
    home: AppRoutesPath.HOME,
    events: EventsRoutesPath.PATH_TO_LIST,
  };
  searchString = '';

  columns: Array<GridColumn|string> = [];

  // GRID
  gridAllowedSortFields = ['id', 'name', 'dateBegin', 'dateEnd', 'price', 'ticketsCount'];
  gridAllowedFilterFields = {
    name: ['name'],
    dateBegin: ['dateBegin', 'dateBeginFrom', 'dateBeginTo'],
    dateEnd: ['dateEnd', 'dateEndFrom', 'dateEndTo'],
    price: ['price'],
  };
  gridSortData = {};

  gridColumns: Array<GridColumn|string> = [
    {title: 'ID', field: 'id'},
    {title: 'Name', field: 'name'},
    {title: 'Date begin', field: 'dateBegin', formatter: this.dateFormatter },
    {title: 'Date end', field: 'dateEnd', formatter: this.dateFormatter },
    {title: 'Price', field: 'price', headClass: 'text-right', cellClass: 'text-right'},
    {title: 'Tickets', field: 'ticketsCount', headClass: 'text-right', cellClass: 'text-right'},
    {title: 'Purchased', field: 'ticketsPurchased', headClass: 'text-right', cellClass: 'text-right'},
    {title: 'Available', field: 'ticketsAvailable', headClass: 'text-right', cellClass: 'text-right'},
    'ACTIONS'
  ];

  constructor(
    private router: Router,
    private currentUserProvider: CurrentUserProvider,
    private eventsService: EventsService,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
    private storageService: StorageService
  ) { super(); }

  ngOnInit() {

    this.searchService.enable();
    this.searchString = this.searchService.get();
    this.createFilterForm();
    this.loadSettings();

    this.subscriptions.push(
      this.currentUserProvider.currentUser$.subscribe(user => {
        this.authorizedUser = user;

        this.access = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.MANAGER, Role.USER]);
        this.accessUser = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.USER]);
        this.accessManager = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.MANAGER]);

      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.loader$.subscribe(isLoading => {
        this.isLoading = isLoading;
      })
    );

    this.subscriptions.push(
      this.searchService.search$.subscribe(searchString => {
        this.searchString = searchString;
        this.applyFilter();
      })
    );

  }

  ngOnDestroy() {
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }

  loadSettings() {
    this.isFilterCollapsed = this.storageService.getItem('EventsList_Filter_IsCollapsed', true);
    this.gridSortData = this.storageService.getItem('EventsList_SortData', {});
    this.filterForm.patchValue(this.storageService.getItem('EventsList_Filter_FormValue', {}));
  }

  saveSettings() {
    this.storageService.setItem('EventsList_SortData', this.gridSortData);
    this.storageService.setItem('EventsList_Filter_IsCollapsed', this.isFilterCollapsed);
    this.storageService.setItem('EventsList_Filter_FormValue', this.filterForm.value);
  }

  onPageChange(gotoPage: number) {
    this.currentPage = gotoPage;
    this.loadData(gotoPage);
  }

  loadData(page: number = this.currentPage) {
    this.gridSearchString = this.searchString;
    this.gridFilterData = this.filterForm.value;
    this.gridCalcColumns();
    this.eventsService.getEvents({
      ...this.filterForm.value,
      filter: this.searchString
    }, this.gridSortData, page, this.pageSize )
      .pipe(
        map((pageData) => {
          this.currentPage  = pageData.page;
          this.totalRecords = pageData.count;
          this.pageSize     = pageData.pageSize;
          return pageData.rows;
        })
      ).subscribe(
      events => {
        this.events = events;
      },
      error => {
        console.error(error);
      }
    );
  }

  onDelete(event: Event) {
    if (confirm(`Delete event: ${event.name}?`)) {
      this.eventsService.deleteEvent(event.id).subscribe(
        () => {
          this.toastService.success('Event deleted');
          this.loadData();
        },
        error => {
          console.error(error);
          this.loadData();
        });
    }
  }

  gridTitleClick(column: GridColumn) {
    this.gridSortColumn(column);
    this.saveSettings();
    this.loadData(1);
  }

  gridActionClick($event: GridActionEvent) {
    const event: Event = $event.record as Event;
    switch ($event.action) {
      case 'BUY': {
        this.router.navigate([ EventsRoutesPath.PATH_TO_LIST, event.id , 'buy' ]);
        break;
      }
      case 'EDIT': {
        this.router.navigate([ EventsRoutesPath.PATH_TO_LIST, event.id ]);
        break;
      }
      case 'DELETE': {
        this.onDelete($event.record as Event);
        break;
      }
    }
  }

  dateFormatter(event: GridFormatterEvent): string {
    return (event.value instanceof Date) ? formatDate(event.value, 'dd.MM.y HH:mm', 'en-US') : '';
  }

  private createFilterForm() {

    this.filterForm = new FormGroup({
      name: new FormControl(null),
      dateBeginFrom: new FormControl(null, [
        Validators.pattern('^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$')
      ]),
      dateBeginTo: new FormControl(null, [
        Validators.pattern('^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$')
      ]),
      dateEndFrom: new FormControl(null, [
        Validators.pattern('^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$')
      ]),
      dateEndTo: new FormControl(null, [
        Validators.pattern('^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$')
      ]),
    });

    this.filterForm.patchValue(this.storageService.getItem('EventsList_Filter_FormValue', {}));
  }

  filterCollapse() {
    this.isFilterCollapsed = !this.isFilterCollapsed;
    this.saveSettings();
  }

  applyFilter(store = false) {
    if (store) {
      this.saveSettings();
    }
    this.loadData(1);
  }

  filterReset() {
    this.filterForm.reset();
    this.saveSettings();
    this.loadData(1);
  }

  gridGetActions() {
    return ($event: GridActionEvent) => {
      const event = $event.record as Event;
      const actions = [];
      if (this.accessUser && event.status === 3 && event.ticketsAvailable > 0) {
        actions.push({
          actionName: 'BUY',
          title: 'Buy',
          class: 'btn-outline-info',
          html: '<i class="fa fa-cart-plus"></i>'
        });
      }
      if (this.accessManager) {
        actions.push({
          actionName: 'EDIT',
          title: 'Edit',
          class: 'btn-outline-success',
          html: '<i class="far fa-edit"></i>'
        });
        actions.push({
          actionName: 'DELETE',
          title: 'Delete',
          class: 'btn-outline-danger',
          html: '<i class="far fa-trash-alt"></i>'
        });
      }
      return actions;
    };
  }

  getRowClass() {
    return ($event: GridActionEvent) => {
      const event = $event.record as Event;
      return (event.status === 1 ? 'table-secondary' : (event.status === 2) ? 'table-warning' : '');
    };
  }
}
