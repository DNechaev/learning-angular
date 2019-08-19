import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DashboardRoutesPath } from '../../../dashboard/dashboard.routing';
import { UsersRoutesPath } from '../../../users/users.routing';
import { EventsRoutesPath } from '../../../events/events.routing';
import { Role } from '../../../core/enums';
import { CurrentUserProvider } from '../../providers/current-user.provider';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private authorizedUser;

  private fullMenuItems = [
    {
      route: DashboardRoutesPath.PATH_DASHBOARD,
      icon: 'fa-home',
      title: 'Dashboard',
      roles: [ Role.ADMIN, Role.MANAGER, Role.USER ]
    },
    {
      route: UsersRoutesPath.PATH_TO_LIST,
      icon: 'fa-users',
      title: 'Users',
      roles: [ Role.ADMIN ]
    },
    {
      route: EventsRoutesPath.PATH_TO_LIST,
      icon: 'fa-bullhorn',
      title: 'Events',
      roles: [ Role.MANAGER ]
    },
  ];

  menuItems = [];

  constructor(
    private currentUserProvider: CurrentUserProvider,
  ) {}

  ngOnInit() {
    this.subscription = this.currentUserProvider.currentUser$.subscribe((user) => {
        this.authorizedUser = user;
        this.calculateMenuItems();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  calculateMenuItems() {
    this.menuItems = this.fullMenuItems.filter((item) => {
      return this.currentUserProvider.userHasRoles(this.authorizedUser, item.roles);
    });
  }

}
