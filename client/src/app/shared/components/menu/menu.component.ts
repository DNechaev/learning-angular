import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersRoutesPath } from '../../../users/users.routing';
import { Role } from '../../enums';
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
      route: UsersRoutesPath.PATH_TO_LIST,
      icon: 'fa-users',
      title: 'Users',
      roles: [ Role.ADMIN ]
    },
    {
      route: '/events',
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
