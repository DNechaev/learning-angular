import {Component, OnDestroy, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {formatDate} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Role} from '../../core/enums';
import {User} from '../../core/user.model';
import {Purchase} from '../../core/purchase.model';
import {PurchasesService} from '../purchases.service';
import {LoaderIndicatorService} from '../../shared/services/loader-indicator.service';
import {SearchService} from '../../shared/services/search.service';
import {ToastService} from '../../shared/services/toast.service';
import {PurchasesRoutesPath} from '../purchases.routing';
import {AppRoutesPath} from '../../app-routing.module';
import {CurrentUserProvider} from '../../shared/providers/current-user.provider';
import {
  GridActionButton,
  GridColumn,
  GridFormatterEvent,
  GridHighlightMap,
  GridRowActionEvent
} from '../../shared/components/grid/grid.interfaces';
import {StorageService} from '../../shared/services/storage.service';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases-list.component.html',
  styleUrls: ['./purchases-list.component.scss'],
  providers: [ PurchasesService ]
})
export class PurchasesListComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  purchases: Purchase[];
  totalRecords = 0;
  currentPage  = 1;
  pageSize     = 10;
  access       = false;
  accessAdmin = false;
  isLoading    = false;
  isFilterCollapsed;
  filterForm: FormGroup;
  highlightMap: GridHighlightMap;
  gridActions: GridActionButton[] = [];
  urls = {
    home: AppRoutesPath.HOME,
    purchases: PurchasesRoutesPath.PATH_TO_LIST,
  };
  searchString = '';

  columns: GridColumn[] = [
      {title: 'ID', field: 'id'},
      {title: 'Date', field: 'date', formatter: this.dateFormatter },
      {title: 'User', field: 'userId', formatter: ($event) => {
          return $event.record.user ? $event.record.user.name : '<span class="text-secondary">Unknown{' + $event.value + '}</span>';
        }
      },
      {title: 'Event', field: 'eventId', formatter: ($event) => {
          return $event.record.event ? $event.record.event.name : '<span class="text-secondary">Unknown{' + $event.value + '}</span>';
        }},
      {title: 'Tickets', field: 'ticketsCount'}
    ];

  private authorizedUser: User;

  constructor(
    private router: Router,
    private currentUserProvider: CurrentUserProvider,
    private purchasesService: PurchasesService,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
    private storageService: StorageService
  ) {}

  ngOnInit() {

    this.searchService.enable();
    this.searchString = this.searchService.get();
    this.isFilterCollapsed = this.storageService.getItem('PurchasesList_Filter_IsCollapsed', true);
    this.createFilterForm();

    this.subscriptions.push(
      this.currentUserProvider.currentUser$.subscribe(user => {
        this.authorizedUser = user;
        this.access = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.ADMIN, Role.USER]);
        this.accessAdmin = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.ADMIN]);
      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.loader$.subscribe(isLoading => {
        this.isLoading = isLoading;
      })
    );

    this.subscriptions.push(
      this.searchService.search$.subscribe(searchString => {
        this.searchString = searchString;
        this.applyFilter();
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
    this.purchasesService.getPurchases({
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
      purchases => {
        this.purchases = purchases;
      },
      error => {
        console.error(error);
      }
    );
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

  gridAction(actionPurchase: GridRowActionEvent) {
    const purchase: Purchase = actionPurchase.record as Purchase;
    switch (actionPurchase.action) {
      case 'EDIT': {
        this.router.navigate([ PurchasesRoutesPath.PATH_TO_LIST, purchase.id ]);
        break;
      }
      case 'DELETE': {
        this.onDelete(actionPurchase.record as Purchase);
        break;
      }
    }
  }

  dateFormatter(purchase: GridFormatterEvent): string {
    return (purchase.value instanceof Date) ? formatDate(purchase.value, 'dd.MM.y HH:mm', 'en-US') : '';
  }

  private createFilterForm() {

    this.filterForm = new FormGroup({
      dateFrom: new FormControl(null, [
        Validators.pattern('^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$')
      ]),
      dateTo: new FormControl(null, [
        Validators.pattern('^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$')
      ]),
    });

    this.filterForm.patchValue(this.storageService.getItem('PurchasesList_Filter_FormValue', {}));
  }

  filterCollapse() {
    this.isFilterCollapsed = !this.isFilterCollapsed;
    this.storageService.setItem('PurchasesList_Filter_IsCollapsed', this.isFilterCollapsed);
  }

  applyFilter(store = false) {
    if (store) {
      this.storageService.setItem('PurchasesList_Filter_FormValue', this.filterForm.value);
    }

    this.loadData(1);
  }

  filterReset() {
    this.filterForm.reset();
    this.storageService.setItem('PurchasesList_Filter_FormValue', this.filterForm.value);
    this.loadData(1);
  }

  makeHighlightMap() {
    this.highlightMap = {
      name: [],
      price: [],
      ticketsCount: []
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
