import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { URL_API_EVENTS } from '../core/consts';
import { Page } from '../core/page.model';
import { Event, EventAdapter } from '../core/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  baseUrl: string = URL_API_EVENTS;

  constructor(
    private http: HttpClient,
    private adapter: EventAdapter
  ) {}

  getEvents( filter: object, page: number, pageSize: number ): Observable<Page> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('pageSize', String(pageSize));

    Object.keys(filter).forEach(key => {
      if (filter[key] !== null) {
        params = params.set(key, filter[key]);
      }
    });

    return this.http.get<Page>(this.baseUrl, { params } ).pipe(
      map((p: Page) => {
        p.rows = p.rows.map(item => this.adapter.input(item));
        return p;
      }),
    );
  }

  getEventById( eventId: number ): Observable<Event> {
    return this.http.get<Event>(this.baseUrl + '/' + eventId ).pipe(
      map((e: Event) => this.adapter.input(e))
    );
  }

  createEvent( event: Event ): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, this.adapter.output(event)).pipe(
      map((e: Event) => this.adapter.input(e))
    );
  }

  updateEvent( eventId: number, event: Event): Observable<Event> {
    return this.http.put<Event>(this.baseUrl + '/' + eventId, this.adapter.output(event)).pipe(
      map((e: Event) => this.adapter.input(e))
    );
  }

  deleteEvent( eventId: number ): Observable<any> {
    return this.http.delete(this.baseUrl + '/' + eventId);
  }

}
