import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Role } from '../../core/enums';
import { User } from '../../core/user.model';
import { Event } from '../../core/event.model';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { EventsService } from '../events.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { EventsRoutesPath } from '../events.routing';
import { AppRoutesPath } from '../../app-routing.module';
import { CurrentUserProvider } from '../../shared/providers/current-user.provider';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-events-edit',
  templateUrl: './events-edit.component.html',
  styleUrls: ['./events-edit.component.scss']
})
export class EventsEditComponent implements OnInit, OnDestroy {

  eventId: number;
  subscriptions: Subscription[] = [];
  authorizedUser: User;
  access        = false;
  isLoading     = false;
  eventLoaded   = false;

  eventForm: FormGroup;

  urls = {
    home: AppRoutesPath.HOME,
    events: EventsRoutesPath.PATH_TO_LIST,
  };

  constructor(
    private currentUserProvider: CurrentUserProvider,
    private eventsService: EventsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
  ) {}


  ngOnInit() {

    this.searchService.disable();

    this.subscriptions.push(
      this.currentUserProvider.currentUser$.subscribe(( user: User ) => {
        this.authorizedUser = user;
        this.access = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.MANAGER]);
      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.loader$.subscribe(( isLoading ) => {
        this.isLoading = isLoading;
      })
    );

    this.createForm();

    this.activatedRoute.data
      .subscribe((data: { event: Event }) => {
        this.applyEvent(data.event);
      });
  }

  ngOnDestroy() {
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }

  onSubmit() {
    if (!this.eventLoaded) {
      return this.toastService.warning('Event won\'t loaded');
    }

    const event = this.eventForm.value;
    event.dateBegin = new Date(event.dateBegin);
    event.dateEnd = new Date(event.dateEnd);

    this.eventsService.updateEvent(this.eventId, event).subscribe(
      (data) => {
        this.toastService.success('Event updated!');
        this.router.navigate([ EventsRoutesPath.PATH_TO_LIST ]);
      },
      error => {
        console.error(error);
      });
  }

  private createForm() {

    this.eventForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      dateBegin: new FormControl(null, [Validators.required]),
      dateEnd: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      ticketsCount: new FormControl(null, [Validators.required]),
    });

  }

  private applyEvent(event: Event): void {
    if (!event) { return; }

    this.toastService.success('Event loaded!');
    this.eventId = event.id;
    const values = {
      ...event,
      dateBegin: (event.dateBegin) ? formatDate(event.dateBegin, 'y-MM-ddTHH:mm', 'en-US') : '',
      dateEnd: (event.dateEnd) ? formatDate(event.dateEnd, 'y-MM-ddTHH:mm', 'en-US') : '',
    };

    this.eventForm.patchValue(values);
    this.eventLoaded = true;

  }

}
