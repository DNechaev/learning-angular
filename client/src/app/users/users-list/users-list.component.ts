import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Role } from '../../shared/enums';
import { User } from '../../shared/models';
import { UsersService } from '../users.service';
// import { AuthenticationService } from '../../auth/services/authentication.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { UsersRoutesPath } from '../users.routing';
import { AppRoutesPath } from '../../app-routing.module';
import {CurrentUserProvider} from '../../shared/providers/current-user.provider';

@Component({
  selector: 'app-users',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  providers: [ UsersService ]
})
export class UsersListComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  users: User[];
  totalRecords = 0;
  currentPage  = 1;
  pageSize     = 10;
  access       = false;
  isLoading    = false;
  urls         = {
    home: AppRoutesPath.HOME,
    users: UsersRoutesPath.PATH_TO_LIST,
  };
  searchString = '';

  private authorizedUser;

  constructor(
    // private authenticationService: AuthenticationService,
    private currentUserProvider: CurrentUserProvider,
    private usersService: UsersService,
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
        this.access         = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.ADMIN]);
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

    // this.loadData();
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
    this.usersService.getUsers(this.searchString, page, this.pageSize )
      .pipe(
        map((pageData) => {
          this.currentPage  = pageData.page;
          this.totalRecords = pageData.count;
          this.pageSize     = pageData.pageSize;
          return pageData.rows;
        })
      ).subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.error(error);
      }
    );
  }

  onDelete(user: User) {
    if (confirm(`Delete user: ${user.email}?`)) {
      this.usersService.deleteUser(user.id).subscribe(
        () => {
          this.toastService.success('User deleted');
          this.loadData();
        },
        error => {
          console.error(error);
          this.loadData();
        });
    }
  }

}
