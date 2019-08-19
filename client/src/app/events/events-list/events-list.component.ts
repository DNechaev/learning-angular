import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
import { GridActionType, GridColumn, GridRowActionEvent, GridFormatterEvent } from '../../shared/components/grid/grid.interfaces';
import {formatDate} from "@angular/common";

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
  isLoading    = false;
  urls         = {
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
      {title: 'Tickets count', field: 'ticketsCount'},
      {title: 'Purchased', field: 'ticketsPurchased'}
    ];

  private authorizedUser: User;

  constructor(
    private router: Router,
    private currentUserProvider: CurrentUserProvider,
    private eventsService: EventsService,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService
  ) {}

  ngOnInit() {

    this.searchService.enable();
    this.searchString = this.searchService.get();

    this.subscriptions.push(
      this.currentUserProvider.currentUser$.subscribe((user) => {
        this.authorizedUser = user;
        this.access         = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.MANAGER]);
      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.loader$.subscribe((isLoading) => {
        this.isLoading = isLoading;
      })
    );

    this.subscriptions.push(
      this.searchService.search$.subscribe((searchString) => {
        this.searchString = searchString;
        this.loadData(1);
      })
    );

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
    this.eventsService.getEvents(this.searchString, page, this.pageSize )
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
      case GridActionType.EDIT: {
        this.router.navigate([ EventsRoutesPath.PATH_TO_LIST, event.id ]);
        break;
      }
      case GridActionType.DELETE: {
        this.onDelete(actionEvent.record as Event);
        break;
      }
    }
  }

  dateFormatter(event: GridFormatterEvent): string {
    return (event.value instanceof Date) ? formatDate(event.value, 'dd.MM.y HH:mm', 'en-US') : '';
  }

}
