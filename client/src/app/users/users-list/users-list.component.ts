import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Role } from '../../core/enums';
import { User } from '../../core/user.model';
import { UsersService } from '../users.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { UsersRoutesPath } from '../users.routing';
import { AppRoutesPath } from '../../app-routing.module';
import { CurrentUserProvider } from '../../shared/providers/current-user.provider';
import { GridActionType, GridColumn, GridRowActionEvent } from '../../shared/components/grid/grid.interfaces';

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
  columns: GridColumn[] = [
      {title: 'ID', field: 'id'},
      {title: 'Name', field: 'name'},
      {title: 'Email', field: 'email'}
    ];

  private authorizedUser;

  constructor(
    private router: Router,
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

  gridAction(event: GridRowActionEvent) {
    const user: User = event.record as User;
    switch (event.action) {
      case GridActionType.EDIT: {
        this.router.navigate([ UsersRoutesPath.PATH_TO_LIST, user.id ]);
        break;
      }
      case GridActionType.DELETE: {
        this.onDelete(event.record as User);
        break;
      }
    }
  }

}
