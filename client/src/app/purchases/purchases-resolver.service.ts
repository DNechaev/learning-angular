import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, EMPTY } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { take, mergeMap } from 'rxjs/operators';

import { Purchase } from '../core/purchase.model';
import { PurchasesRoutesPath } from './purchases.routing';
import { PurchasesService } from './purchases.service';

@Injectable({
  providedIn: 'root'
})
export class PurchasesResolverService implements Resolve<Purchase> {

  constructor(
    private purchasesService: PurchasesService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Purchase> | Observable<never> {

    if (!route.paramMap.has('id')) {
      this.router.navigate([PurchasesRoutesPath.PATH_TO_LIST]);
      return EMPTY;
    }

    const id = route.paramMap.get('id');

    return this.purchasesService.getPurchaseById(+id).pipe(
      take(1),
      mergeMap(purchase => {
        if (purchase) {
          return of(purchase);
        } else { // id not found
          this.router.navigate([PurchasesRoutesPath.PATH_TO_LIST]);
          return EMPTY;
        }
      })
    );
  }

}
