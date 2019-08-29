import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Role } from '../../core/enums';
import { User } from '../../core/user.model';
import { Purchase } from '../../core/purchase.model';
import { PurchasesService } from '../purchases.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { PurchasesRoutesPath } from '../purchases.routing';
import { AppRoutesPath } from '../../app-routing.module';
import { CurrentUserProvider } from '../../shared/providers/current-user.provider';
import {
  GridColumn,
  GridFormatterEvent,
  GridActionEvent
} from '../../shared/components/grid/grid.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { BaseListComponent } from '../../core/base-list.component';
import { EventsRoutesPath } from '../../events/events.routing';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases-list.component.html',
  styleUrls: ['./purchases-list.component.scss'],
  providers: [ PurchasesService ]
})
export class PurchasesListComponent extends BaseListComponent implements OnInit, OnDestroy {

  private authorizedUser: User;

  subscriptions: Subscription[] = [];
  purchases: Purchase[];
  totalRecords = 0;
  currentPage  = 1;
  pageSize     = 10;
  access       = false;
  accessAdmin  = false;
  isLoading    = false;
  isFilterCollapsed;
  filterForm: FormGroup;

  urls = {
    home: AppRoutesPath.HOME,
    purchases: PurchasesRoutesPath.PATH_TO_LIST,
  };

  // GRID
  gridAllowedSortFields = ['id', 'date'];
  gridAllowedFilterFields = {
    date: ['date', 'dateFrom', 'dateTo']
  };
  gridSortData = {};

  gridColumns: Array<GridColumn|string> = [
    { title: 'ID', field: 'id' },
    { title: 'Date', field: 'date', formatter: this.dateFormatter },
    { title: 'Event', field: 'eventId', formatter: ($event) => {
        return $event.record.event ?
          '<a href="' + EventsRoutesPath.PATH_TO_LIST + '/' + $event.record.event.id + '">' + $event.record.event.name + '</a>' :
          '<span class="text-secondary">Unknown{' + $event.value + '}</span>';
      }},
    { title: 'User', field: 'userId', formatter: ($event) => {
        return $event.record.user ? $event.record.user.name : '<span class="text-secondary">Unknown{' + $event.value + '}</span>';
      }},
    { title: 'Tickets', field: 'ticketsCount', headClass: 'text-right', cellClass: 'text-right'},
    { title: 'Price', field: 'price', headClass: 'text-right', cellClass: 'text-right', formatter: ($event) => {
        return $event.record.event ? $event.record.event.price : '<span class="text-secondary">Unknown{' + $event.value + '}</span>';
      }},
    { title: 'Sum', field: 'sum', headClass: 'text-right', cellClass: 'text-right' }
  ];

  constructor(
    private router: Router,
    private currentUserProvider: CurrentUserProvider,
    private purchasesService: PurchasesService,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
    private storageService: StorageService
  ) { super(); }

  ngOnInit() {

    this.searchService.disable();
    this.gridSearchString = this.searchService.get();
    this.createFilterForm();
    this.loadSettings();

    this.subscriptions.push(
      this.currentUserProvider.currentUser$.subscribe(user => {
        this.authorizedUser = user;
        this.access = this.currentUserProvider.userHasRoles(this.authorizedUser, [ Role.ADMIN, Role.USER ]);
        this.accessAdmin = this.currentUserProvider.userHasRoles(this.authorizedUser, [ Role.ADMIN ]);
      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.loader$.subscribe(isLoading => {
        this.isLoading = isLoading;
      })
    );

    this.subscriptions.push(
      this.searchService.search$.subscribe(searchString => {
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
    this.purchasesService.getPurchases({
      ...this.filterForm.value,
      filter: this.gridSearchString
    }, this.gridSortData,  page, this.pageSize )
      .pipe(
        map((pageData) => {
          this.currentPage  = pageData.page;
          this.totalRecords = pageData.count;
          this.pageSize     = pageData.pageSize;
          return pageData.rows;
        })
      ).subscribe(
      purchases => {
        this.purchases = purchases;
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

  onDelete(purchase: Purchase) {
    if (confirm(`Delete purchase: ${purchase.id}?`)) {
      this.purchasesService.deletePurchase(purchase.id).subscribe(
        () => {
          this.toastService.success('Purchase deleted');
          this.loadData();
        },
        error => {
          console.error(error);
          this.loadData();
        });
    }
  }

  dateFormatter(purchase: GridFormatterEvent): string {
    return (purchase.value instanceof Date) ? formatDate(purchase.value, 'dd.MM.y HH:mm', 'en-US') : '';
  }
  /**
   * -------------------------------------------
   * S E T T I N G S
   * -------------------------------------------
   */

  loadSettings() {
    this.isFilterCollapsed = this.storageService.getItem('PurchasesList_Filter_IsCollapsed', true);
    this.gridSortData = this.storageService.getItem('PurchasesList_SortData', {});
    this.filterForm.patchValue(this.storageService.getItem('PurchasesList_Filter_FormValue', {}));
  }

  saveSettings() {
    this.storageService.setItem('PurchasesList_SortData', this.gridSortData);
    this.storageService.setItem('PurchasesList_Filter_IsCollapsed', this.isFilterCollapsed);
    this.storageService.setItem('PurchasesList_Filter_FormValue', this.filterForm.value);
  }

  /**
   * -------------------------------------------
   * F O R M  F I L T E R
   * -------------------------------------------
   */

  private createFilterForm() {
    this.filterForm = new FormGroup({
      dateFrom: new FormControl(null, [
        Validators.pattern('^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$')
      ]),
      dateTo: new FormControl(null, [
        Validators.pattern('^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$')
      ]),
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
      if (this.accessAdmin) {
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
      }
      return [];
    };
  }

  gridActionClick($event: GridActionEvent) {
    const purchase: Purchase = $event.record as Purchase;
    switch ($event.action) {
      case 'EDIT': {
        this.router.navigate([ PurchasesRoutesPath.PATH_TO_LIST, purchase.id ]);
        break;
      }
      case 'DELETE': {
        this.onDelete($event.record as Purchase);
        break;
      }
    }
  }

  gridTitleClick(column: GridColumn) {
    this.gridSortColumn(column);
    this.saveSettings();
    this.loadData(1);
  }

  gridCalcColumns() {
    super.gridCalcColumns((columns) => {
      if (this.accessAdmin) {
        columns.push('ACTIONS');
      }
      return columns;
    });
  }

}
