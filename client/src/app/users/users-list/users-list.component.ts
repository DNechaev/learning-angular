import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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
  GridActionButton,
  GridColumn,
  GridHighlightMap,
  GridRowActionEvent
} from '../../shared/components/grid/grid.interfaces';
import { StorageService } from '../../shared/services/storage.service';


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
  isFilterCollapsed;
  filterForm: FormGroup;
  highlightMap: GridHighlightMap;
  gridActions: GridActionButton[] = [];
  urls = {
    home: AppRoutesPath.HOME,
    users: UsersRoutesPath.PATH_TO_LIST,
  };
  searchString = '';
  columns: GridColumn[] = [
      {title: 'ID', field: 'id'},
      {title: 'Name', field: 'name'},
      {title: 'Email', field: 'email'},
      {title: 'Roles', field: 'roles', formatter: (event) => {
          return (event.value as Array<any>).map(v => v.name).join(', ');
        }}
    ];

  private authorizedUser;

  constructor(
    private router: Router,
    private currentUserProvider: CurrentUserProvider,
    private usersService: UsersService,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
    private storageService: StorageService
  ) {}

  ngOnInit() {

    this.searchService.enable();
    this.searchString = this.searchService.get();
    this.isFilterCollapsed = this.storageService.getItem('UsersList_Filter_IsCollapsed', true);
    this.createFilterForm();

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

    this.gridActions.push({actionName: 'EDIT', title: 'Edit', class: 'btn-outline-success', html: '<i class="far fa-edit"></i>'});
    this.gridActions.push({actionName: 'DELETE', title: 'Delete', class: 'btn-outline-danger', html: '<i class="far fa-trash-alt"></i>'});
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
    this.makeHighlightMap();
    this.usersService.getUsers({
      ...this.filterForm.value,
      filter: this.searchString
    }, page, this.pageSize )
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
      case 'EDIT': {
        this.router.navigate([ UsersRoutesPath.PATH_TO_LIST, user.id ]);
        break;
      }
      case 'DELETE': {
        this.onDelete(event.record as User);
        break;
      }
    }
  }

  private createFilterForm() {

    this.filterForm = new FormGroup({
      name: new FormControl(null),
      email: new FormControl(null),
    });

    this.filterForm.patchValue(this.storageService.getItem('UsersList_Filter_FormValue', {}));
  }

  filterCollapse() {
    this.isFilterCollapsed = !this.isFilterCollapsed;
    this.storageService.setItem('UsersList_Filter_IsCollapsed', this.isFilterCollapsed);
  }

  filterReset() {
    this.filterForm.reset();
    this.storageService.setItem('UsersList_Filter_FormValue', this.filterForm.value);
    this.loadData(1);
  }

  applyFilter(store = false) {
    if (store) {
      this.storageService.setItem('UsersList_Filter_FormValue', this.filterForm.value);
    }

    this.loadData(1);
  }

  makeHighlightMap() {
    this.highlightMap = {
      name: [],
      email: []
    };

    if (this.searchString.length) {
      Object.keys(this.highlightMap).forEach( key => this.highlightMap[key].push(this.searchString));
    }

    Object.keys(this.filterForm.value).forEach( key => {
      if (key in this.highlightMap) {
        this.highlightMap[key].push(this.filterForm.value[key]);
      }
    });
  }

}
