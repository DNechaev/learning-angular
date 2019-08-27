import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserProvider } from '../shared/providers/current-user.provider';
import { EventsService } from '../events/events.service';
import { PurchasesService } from '../purchases/purchases.service';
import { Role } from '../core/enums';
import { SearchService } from '../shared/services/search.service';
import { User } from '../core/user.model';
import { Subscription } from 'rxjs';
import { AppRoutesPath } from '../app-routing.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  authorizedUser: User;
  subscriptions: Subscription[] = [];
  urls = {
    home: AppRoutesPath.HOME,
  };

  constructor(
    private router: Router,
    private currentUserProvider: CurrentUserProvider,
    private eventsService: EventsService,
    private purchasesService: PurchasesService,
    private searchService: SearchService,
  ) {}

  ngOnInit() {

    this.searchService.disable();

    this.subscriptions.push(
      this.currentUserProvider.currentUser$.subscribe(user => {
        this.authorizedUser = user;
      })
    );

  }

  ngOnDestroy() {
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }

}
