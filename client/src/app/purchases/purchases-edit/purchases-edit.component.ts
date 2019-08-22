import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Role } from '../../core/enums';
import { User } from '../../core/user.model';
import { Purchase } from '../../core/purchase.model';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { PurchasesService } from '../purchases.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { PurchasesRoutesPath } from '../purchases.routing';
import { AppRoutesPath } from '../../app-routing.module';
import { CurrentUserProvider } from '../../shared/providers/current-user.provider';
import { formatDate } from '@angular/common';
import { validateDate } from 'src/app/core/validators';

@Component({
  selector: 'app-purchases-edit',
  templateUrl: './purchases-edit.component.html',
  styleUrls: ['./purchases-edit.component.scss']
})
export class PurchasesEditComponent implements OnInit, OnDestroy {

  purchaseId: number;
  subscriptions: Subscription[] = [];
  authorizedUser: User;
  access        = false;
  isLoading     = false;
  purchaseLoaded   = false;

  purchaseForm: FormGroup;

  urls = {
    home: AppRoutesPath.HOME,
    purchases: PurchasesRoutesPath.PATH_TO_LIST,
  };

  constructor(
    private currentUserProvider: CurrentUserProvider,
    private purchasesService: PurchasesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
  ) {}


  ngOnInit() {

    this.searchService.disable();

    this.subscriptions.push(
      this.currentUserProvider.currentUser$.subscribe(( user: User ) => {
        this.authorizedUser = user;
        this.access = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.ADMIN]);
      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.loader$.subscribe(( isLoading ) => {
        this.isLoading = isLoading;
      })
    );

    this.createForm();

    this.activatedRoute.data
      .subscribe((data: { purchase: Purchase }) => {
        this.applyPurchase(data.purchase);
      });
  }

  ngOnDestroy() {
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }

  onSubmit() {
    if (!this.purchaseLoaded) {
      return this.toastService.warning('Purchase won\'t loaded');
    }

    if (!this.purchaseForm.valid) { return; }

    const purchase = this.purchaseForm.value;
    purchase.date = new Date(purchase.date);

    this.purchasesService.updatePurchase(this.purchaseId, purchase).subscribe(
      () => {
        this.toastService.success('Purchase updated!');
        this.router.navigate([ PurchasesRoutesPath.PATH_TO_LIST ]);
      },
      error => {
        console.error(error);
      });
  }

  private createForm() {

    this.purchaseForm = new FormGroup({
      date: new FormControl(null, [
        Validators.required,
        Validators.pattern('^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):([0-5][0-9])$')
      ]),
      userId: new FormControl(null, [Validators.required, Validators.min(0)]),
      eventId: new FormControl(null, [Validators.required, Validators.min(0)]),
      ticketsCount: new FormControl(null, [Validators.required, Validators.min(1)]),
    });

  }

  private applyPurchase(purchase: Purchase): void {
    if (!purchase) { return; }

    this.toastService.success('Purchase loaded!');
    this.purchaseId = purchase.id;
    const values = {
      ...purchase,
      date: (purchase.date) ? formatDate(purchase.date, 'y-MM-ddTHH:mm', 'en-US') : null,
    };

    this.purchaseForm.patchValue(values);
    this.purchaseLoaded = true;

  }

}
