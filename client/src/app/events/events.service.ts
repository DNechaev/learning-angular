import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { URL_API_EVENTS } from '../core/consts';
import { Page } from '../core/page.model';
import { Event, EventAdapter } from '../core/event.model';
import {Purchase, PurchaseAdapter} from '../core/purchase.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  baseUrl: string = URL_API_EVENTS;

  constructor(
    private http: HttpClient,
    private eventAdapter: EventAdapter,
    private purchaseAdapter: PurchaseAdapter
  ) {}

  getEvents( where: object, order: object, page: number, pageSize: number ): Observable<Page> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('where', JSON.stringify(where))
      .set('order', JSON.stringify(order));

    return this.http.get<Page>(this.baseUrl, { params } ).pipe(
      map((p: Page) => {
        p.rows = p.rows.map(item => this.eventAdapter.input(item));
        return p;
      }),
    );
  }

  getEventById( eventId: number ): Observable<Event> {
    return this.http.get<Event>(this.baseUrl + '/' + eventId ).pipe(
      map((e: Event) => this.eventAdapter.input(e))
    );
  }

  createEvent( event: Event ): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, this.eventAdapter.output(event)).pipe(
      map((e: Event) => this.eventAdapter.input(e))
    );
  }

  updateEvent( eventId: number, event: Event): Observable<Event> {
    return this.http.put<Event>(this.baseUrl + '/' + eventId, this.eventAdapter.output(event)).pipe(
      map((e: Event) => this.eventAdapter.input(e))
    );
  }

  deleteEvent( eventId: number ): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + eventId);
  }

  buyEvent( eventId: number, ticketsCount: number ): Observable<Purchase> {
    return this.http.post<Purchase>(this.baseUrl + '/' + eventId + '/buy', {
      ticketsCount
    }).pipe(
      map((p: Purchase) => this.purchaseAdapter.input(p))
    );
  }

}
