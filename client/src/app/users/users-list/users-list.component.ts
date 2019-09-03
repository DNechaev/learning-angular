import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { Role } from '../../core/enums';
import { User } from '../../core/user.model';
import { UsersService } from '../users.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { UsersRoutesPath } from '../users.routing';
import { AppRoutesPath } from '../../app-routing.module';
import { CurrentUserProvider } from '../../shared/providers/current-user.provider';
import {
  GridActionEvent,
  GridColumn
} from '../../shared/components/grid/grid.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { BaseListComponent } from '../../core/base-list.component';

@Component({
  selector: 'app-users',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  providers: [ UsersService ]
})
export class UsersListComponent extends BaseListComponent implements OnInit, OnDestroy {

  private authorizedUser;

  subscriptions: Subscription[] = [];
  users: User[];
  totalRecords = 0;
  currentPage  = 1;
  pageSize     = 10;
  access       = false;
  isLoading    = false;

  isFilterCollapsed;
  filterForm: FormGroup;

  urls = {
    home: AppRoutesPath.HOME,
    users: UsersRoutesPath.PATH_TO_LIST,
  };

  // GRID
  gridAllowedSortFields = ['id', 'name', 'email'];
  gridAllowedFilterFields = {
    name: ['name'],
    email: ['email'],
  };
  gridSortData = {};

  gridColumns: Array<GridColumn|string> = [
    {title: 'ID', field: 'id'},
    {title: 'Name', field: 'name'},
    {title: 'Email', field: 'email'},
    {title: 'Roles', field: 'roles', formatter: (event) => {
        return (event.value as Array<any>).map(v => v.name).join(', ');
      }},
    'ACTIONS'
  ];

  constructor(
    private router: Router,
    private currentUserProvider: CurrentUserProvider,
    private usersService: UsersService,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
    private storageService: StorageService
  ) { super(); }

  ngOnInit() {

    this.searchService.enable();
    this.gridSearchString = this.searchService.get();
    this.createFilterForm();
    this.loadSettings();

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
        this.gridSearchString = searchString;
        this.filterApply();
      })
    );

  }

  ngOnDestroy() {
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }



  loadData(page: number = this.currentPage) {
    this.gridFilterData = this.filterForm.value;
    this.gridCalcColumns();
    this.usersService.getUsers({
      ...this.filterForm.value,
      filter: this.gridSearchString
    }, this.gridSortData, page, this.pageSize )
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

  onPageChange(gotoPage: number) {
    this.currentPage = gotoPage;
    this.loadData(gotoPage);
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

  /**
   * -------------------------------------------
   * S E T T I N G S
   * -------------------------------------------
   */

  loadSettings() {
    this.isFilterCollapsed = this.storageService.getItem('UsersList_Filter_IsCollapsed', true);
    this.gridSortData = this.storageService.getItem('UsersList_SortData', {});
    this.filterForm.patchValue(this.storageService.getItem('UsersList_Filter_FormValue', {}));
  }

  saveSettings() {
    this.storageService.setItem('UsersList_SortData', this.gridSortData);
    this.storageService.setItem('UsersList_Filter_IsCollapsed', this.isFilterCollapsed);
    this.storageService.setItem('UsersList_Filter_FormValue', this.filterForm.value);
  }

  /**
   * -------------------------------------------
   * F O R M  F I L T E R
   * -------------------------------------------
   */

  private createFilterForm() {
    this.filterForm = new FormGroup({
      name: new FormControl(null),
      email: new FormControl(null),
    });
  }

  filterCollapse() {
    this.isFilterCollapsed = !this.isFilterCollapsed;
    this.saveSettings();
  }

  filterApply(store = false) {
    if (store) {
      this.saveSettings();
    }
    this.loadData(1);
  }

  filterReset() {
    this.filterForm.reset();
    this.saveSettings();
    this.loadData(1);
  }

  /**
   * -------------------------------------------
   * G R I D
   * -------------------------------------------
   */

  gridGetActions() {
    return ($event: GridActionEvent) => {
      return [
        {
          actionName: 'EDIT',
          title: 'Edit',
          class: 'btn-outline-success',
          html: '<i class="far fa-edit"></i>'
        }, {
          actionName: 'DELETE',
          title: 'Delete',
          class: 'btn-outline-danger',
          html: '<i class="far fa-trash-alt"></i>'
        }
      ];
    };
  }

  gridActionClick($event: GridActionEvent) {
    const user: User = $event.record as User;
    switch ($event.action) {
      case 'EDIT': {
        this.router.navigate([ UsersRoutesPath.PATH_TO_LIST, user.id ]);
        break;
      }
      case 'DELETE': {
        this.onDelete($event.record as User);
        break;
      }
    }
  }

  gridTitleClick(column: GridColumn) {
    this.gridSortColumn(column);
    this.saveSettings();
    this.loadData(1);
  }

}
