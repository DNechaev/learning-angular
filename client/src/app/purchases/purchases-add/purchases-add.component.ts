import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { CurrentUserProvider } from '../../shared/providers/current-user.provider';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { PurchasesService } from '../purchases.service';
import { Role } from '../../core/enums';
import { User } from '../../core/user.model';
import { AppRoutesPath } from '../../app-routing.module';
import { PurchasesRoutesPath } from '../purchases.routing';
import { UsersService } from 'src/app/users/users.service';
import { Page } from '../../core/page.model';
import { EventsService } from '../../events/events.service';

@Component({
  selector: 'app-purchases-add',
  templateUrl: './purchases-add.component.html',
  styleUrls: ['./purchases-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PurchasesAddComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  authorizedUser: User;
  access       = false;
  isLoading    = false;

  usersForSelect$: Observable<User[]>;
  eventsForSelect$: Observable<Event[]>;

  purchaseForm: FormGroup;

  urls = {
    home: AppRoutesPath.HOME,
    purchases: PurchasesRoutesPath.PATH_TO_LIST,
  };

  constructor(
    private currentUserProvider: CurrentUserProvider,
    private purchasesService: PurchasesService,
    private router: Router,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
    private usersService: UsersService,
    private eventsService: EventsService,
  ) {}

  ngOnInit() {

    this.usersForSelect$ = this.usersService.getUsers({filter: ''}, {name: 'asc'}, 1, 200).pipe(
      map((p: Page) => p.rows)
    );

    this.eventsForSelect$ = this.eventsService.getEvents({filter: ''}, {name: 'asc'}, 1, 200).pipe(
      map((p: Page) => p.rows)
    );

    this.searchService.disable();

    this.subscriptions.push(
      this.currentUserProvider.currentUser$.subscribe((user: User) => {
        this.authorizedUser = user;
        this.access = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.ADMIN]);
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

    this.purchaseForm = new FormGroup({
      date: new FormControl(null, [
        Validators.required,
        Validators.pattern('^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$')
      ]),
      userId: new FormControl(null, [Validators.required, Validators.min(0)]),
      eventId: new FormControl(null, [Validators.required, Validators.min(0)]),
      ticketsCount: new FormControl(1, [Validators.required, Validators.min(1)]),
    });

  }

  onSubmit() {

    if (!this.purchaseForm.valid) { return; }

    const purchase = this.purchaseForm.value;
    purchase.date = new Date(purchase.date);

    this.purchasesService.createPurchase(purchase).subscribe(
      (data) => {
        this.toastService.success('Purchase created!');
        this.router.navigate([ PurchasesRoutesPath.PATH_TO_LIST ]);
      },
      error => {
        console.error(error);
      });
  }

}

