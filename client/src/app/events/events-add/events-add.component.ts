import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { CurrentUserProvider } from '../../shared/providers/current-user.provider';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { EventsService } from '../events.service';
import { Role } from '../../core/enums';
import { User } from '../../core/user.model';
import { AppRoutesPath } from '../../app-routing.module';
import { EventsRoutesPath } from '../events.routing';
import {validateDate} from "../../core/validators";

@Component({
  selector: 'app-events-add',
  templateUrl: './events-add.component.html',
  styleUrls: ['./events-add.component.scss']
})
export class EventsAddComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  authorizedUser: User;
  access       = false;
  isLoading    = false;

  eventForm: FormGroup;

  urls = {
    home: AppRoutesPath.HOME,
    events: EventsRoutesPath.PATH_TO_LIST,
  };

  constructor(
    private currentUserProvider: CurrentUserProvider,
    private eventsService: EventsService,
    private router: Router,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {

    this.searchService.disable();

    this.subscriptions.push(
      this.currentUserProvider.currentUser$.subscribe((user: User) => {
        this.authorizedUser = user;
        this.access = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.MANAGER]);
      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.loader$.subscribe((isLoading) => {
        this.isLoading = isLoading;
      })
    );

    this.createForm();

  }

  ngOnDestroy() {
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }

  private createForm() {

    this.eventForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      dateBegin: new FormControl(null, [
        Validators.required,
        Validators.pattern('^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$')
      ]),
      dateEnd: new FormControl(null, [
        Validators.required,
        Validators.pattern('^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$')
      ]),
      price: new FormControl(null, [Validators.required, Validators.min(1)]),
      ticketsCount: new FormControl(null, [Validators.required, Validators.min(0)]),
    }, [
        validateDate('dateBegin', 'dateEnd')
    ]);

  }

  onSubmit() {

    if (!this.eventForm.valid) { return; }

    const event = this.eventForm.value;
    event.dateBegin = new Date(event.dateBegin);
    event.dateEnd = new Date(event.dateEnd);

    this.eventsService.createEvent(event).subscribe(
      (data) => {
        this.toastService.success('Event created!');
        this.router.navigate([ EventsRoutesPath.PATH_TO_LIST ]);
      },
      error => {
        console.error(error);
      });
  }

}

