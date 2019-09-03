import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserProvider } from '../shared/providers/current-user.provider';
import { Role } from '../core/enums';
import { User } from '../core/user.model';
import { Subscription } from 'rxjs';
import { AppRoutesPath } from '../app-routing.module';
import { AuthRoutesPath } from '../auth/auth.routing';
import { PurchasesRoutesPath } from '../purchases/purchases.routing';
import { EventsRoutesPath } from '../events/events.routing';
import { UsersRoutesPath } from '../users/users.routing';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  authorizedUser: User;
  access = false;
  accessAdmin = false;
  accessManager = false;
  accessUser = false;

  reportUsers;
  reportEvents;
  reportPurchases;

  subscriptions: Subscription[] = [];
  urls = {
    home: AppRoutesPath.HOME,
    logout: AuthRoutesPath.PATH_TO_LOGOUT,
    users: UsersRoutesPath.PATH_TO_LIST,
    events: EventsRoutesPath.PATH_TO_LIST,
    purchases: PurchasesRoutesPath.PATH_TO_LIST
  };

  constructor(
    private router: Router,
    private currentUserProvider: CurrentUserProvider,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {

    this.subscriptions.push(
      this.currentUserProvider.currentUser$.subscribe(user => {
        this.authorizedUser = user;
        this.access = this.currentUserProvider.userHasRoles(this.authorizedUser, [ Role.ADMIN, Role.MANAGER, Role.USER ]);
        this.accessAdmin = this.currentUserProvider.userHasRoles(this.authorizedUser, [ Role.ADMIN ]);
        this.accessManager = this.currentUserProvider.userHasRoles(this.authorizedUser, [ Role.MANAGER ]);
        this.accessUser = this.currentUserProvider.userHasRoles(this.authorizedUser, [ Role.USER ]);
      })
    );
    this.loadReport();
  }

  ngOnDestroy() {
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }

  loadReport() {
    this.dashboardService.getReport().subscribe(
      report => {
        this.reportUsers = report.users;
        this.reportEvents = report.events;
        this.reportPurchases = report.purchases;
      },
      error => {
        console.error(error);
      }
    );
  }

}
