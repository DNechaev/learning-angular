import {Component, OnDestroy, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {formatDate} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Role} from '../../core/enums';
import {User} from '../../core/user.model';
import {Event} from '../../core/event.model';
import {EventsService} from '../events.service';
import {LoaderIndicatorService} from '../../shared/services/loader-indicator.service';
import {SearchService} from '../../shared/services/search.service';
import {ToastService} from '../../shared/services/toast.service';
import {EventsRoutesPath} from '../events.routing';
import {AppRoutesPath} from '../../app-routing.module';
import {CurrentUserProvider} from '../../shared/providers/current-user.provider';
import {
  GridActionButton,
  GridColumn,
  GridFormatterEvent,
  GridHighlightMap,
  GridRowActionEvent
} from '../../shared/components/grid/grid.interfaces';
import {StorageService} from '../../shared/services/storage.service';

@Component({
  selector: 'app-events',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
  providers: [ EventsService ]
})
export class EventsListComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  events: Event[];
  totalRecords = 0;
  currentPage  = 1;
  pageSize     = 10;
  access       = false;
  accessManager = false;
  isLoading    = false;
  isFilterCollapsed;
  filterForm: FormGroup;
  highlightMap: GridHighlightMap;
  gridActions: GridActionButton[] = [];
  urls = {
    home: AppRoutesPath.HOME,
    events: EventsRoutesPath.PATH_TO_LIST,
  };
  searchString = '';

  columns: GridColumn[] = [
      {title: 'ID', field: 'id'},
      {title: 'Name', field: 'name'},
      {title: 'Date begin', field: 'dateBegin', formatter: this.dateFormatter },
      {title: 'Date end', field: 'dateEnd', formatter: this.dateFormatter },
      {title: 'Price', field: 'price'},
      {title: 'Tickets', field: 'ticketsCount'},
      {title: 'Purchased', field: 'ticketsPurchased'},
      {title: 'Available', field: 'ticketsAvailable'}
    ];

  private authorizedUser: User;

  constructor(
    private router: Router,
    private currentUserProvider: CurrentUserProvider,
    private eventsService: EventsService,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
    private storageService: StorageService
  ) {}

  ngOnInit() {

    this.searchService.enable();
    this.searchString = this.searchService.get();
    this.isFilterCollapsed = this.storageService.getItem('EventsList_Filter_IsCollapsed', true);
    this.createFilterForm();

    this.subscriptions.push(
      this.currentUserProvider.currentUser$.subscribe(user => {
        this.authorizedUser = user;
        this.access = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.MANAGER, Role.USER]);
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

    this.gridActions.push({actionName: 'EDIT', title: 'Edit', class: 'btn-outline-success', html: '<i class="far fa-edit"></i>'});
    this.gridActions.push({actionName: 'DELETE', title: 'Delete', class: 'btn-outline-danger', html: '<i class="far fa-trash-alt"></i>'});
  }

  ngOnDestroy() {
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }

  onPageChange(gotoPage: number) {
    this.currentPage = gotoPage;
    this.loadData(gotoPage);
  }

  loadData(page: number = this.currentPage) {
    this.makeHighlightMap();
    this.eventsService.getEvents({
      ...this.filterForm.value,
      filter: this.searchString
    }, page, this.pageSize )
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

  gridAction(actionEvent: GridRowActionEvent) {
    const event: Event = actionEvent.record as Event;
    switch (actionEvent.action) {
      case 'EDIT': {
        this.router.navigate([ EventsRoutesPath.PATH_TO_LIST, event.id ]);
        break;
      }
      case 'DELETE': {
        this.onDelete(actionEvent.record as Event);
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
    this.storageService.setItem('EventsList_Filter_IsCollapsed', this.isFilterCollapsed);
  }

  applyFilter(store = false) {
    if (store) {
      this.storageService.setItem('EventsList_Filter_FormValue', this.filterForm.value);
    }

    this.loadData(1);
  }

  filterReset() {
    this.filterForm.reset();
    this.storageService.setItem('EventsList_Filter_FormValue', this.filterForm.value);
    this.loadData(1);
  }

  makeHighlightMap() {
    this.highlightMap = {
      name: [],
      price: [],
      ticketsCount: []
    };

    if (this.searchString.length) {
      Object.keys(this.highlightMap).forEach( key => this.highlightMap[key].push(this.searchString));
    }

    Object.keys(this.filterForm.value).forEach( key => {
      if (key in this.highlightMap) {
        this.highlightMap[key].push(this.filterForm.value[key]);
      }
    });
  }

}
