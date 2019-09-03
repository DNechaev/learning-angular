import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { URL_API_PURCHASES } from '../core/consts';
import { Page } from '../core/page.model';
import { Purchase, PurchaseAdapter } from '../core/purchase.model';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {

  baseUrl: string = URL_API_PURCHASES;

  constructor(
    private http: HttpClient,
    private adapter: PurchaseAdapter
  ) {}

  getPurchases( where: object, order: object, page: number, pageSize: number ): Observable<Page> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('where', JSON.stringify(where))
      .set('order', JSON.stringify(order));

    return this.http.get<Page>(this.baseUrl, { params } ).pipe(
      map((p: Page) => {
        p.rows = p.rows.map(item => this.adapter.input(item));
        return p;
      }),
    );
  }

  getPurchaseById( purchaseId: number ): Observable<Purchase> {
    return this.http.get<Purchase>(this.baseUrl + '/' + purchaseId ).pipe(
      map((e: Purchase) => this.adapter.input(e))
    );
  }

  createPurchase( purchase: Purchase ): Observable<Purchase> {
    return this.http.post<Purchase>(this.baseUrl, this.adapter.output(purchase)).pipe(
      map((e: Purchase) => this.adapter.input(e))
    );
  }

  updatePurchase( purchaseId: number, purchase: Purchase): Observable<Purchase> {
    return this.http.put<Purchase>(this.baseUrl + '/' + purchaseId, this.adapter.output(purchase)).pipe(
      map((e: Purchase) => this.adapter.input(e))
    );
  }

  deletePurchase( purchaseId: number ): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + purchaseId);
  }

}
