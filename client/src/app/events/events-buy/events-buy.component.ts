import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

import {Role} from '../../core/enums';
import {User} from '../../core/user.model';
import {Event} from '../../core/event.model';
import {SearchService} from '../../shared/services/search.service';
import {ToastService} from '../../shared/services/toast.service';
import {EventsService} from '../events.service';
import {LoaderIndicatorService} from '../../shared/services/loader-indicator.service';
import {EventsRoutesPath} from '../events.routing';
import {AppRoutesPath} from '../../app-routing.module';
import {CurrentUserProvider} from '../../shared/providers/current-user.provider';
import {PurchasesRoutesPath} from "../../purchases/purchases.routing";

@Component({
  selector: 'app-events-buy',
  templateUrl: './events-buy.component.html',
  styleUrls: ['./events-buy.component.scss']
})
export class EventsBuyComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  authorizedUser: User;
  access        = false;
  isLoading     = false;
  eventLoaded   = false;
  canBuy        = false;

  buyForm: FormGroup;
  event: Event;

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
        this.access = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.USER]);
      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.loader$.subscribe(( isLoading ) => {
        this.isLoading = isLoading;
      })
    );

    this.activatedRoute.data
      .subscribe((data: { event: Event }) => {
        this.createForm(data.event);
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

    if (!this.buyForm.valid) { return; }

    const buy = this.buyForm.value;

    this.eventsService.buyEvent(this.event.id, +buy.ticketsCount).subscribe(
      () => {
        this.toastService.success('Tickets successfully purchased!');
        this.router.navigate([ PurchasesRoutesPath.PATH_TO_LIST ]);
      },
      error => {
        console.error(error);
      });
  }

  private createForm(event: Event) {

    this.buyForm = new FormGroup({
      ticketsCount: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(event.ticketsAvailable)]),
    });

  }

  private applyEvent(event: Event): void {
    if (!event) { return; }

    this.event = event;
    this.eventLoaded = true;

    if (event.ticketsAvailable > 0) {
      this.canBuy = true;
    }

    this.buyForm.patchValue({
      ticketsCount: 1
    });

  }

}
