import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, EMPTY } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { take, mergeMap } from 'rxjs/operators';

import { Event } from '../core/event.model';
import { EventsRoutesPath } from './events.routing';
import { EventsService } from './events.service';

@Injectable({
  providedIn: 'root'
})
export class EventsResolverService implements Resolve<Event> {

  constructor(
    private eventsService: EventsService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Event> | Observable<never> {

    if (!route.paramMap.has('id')) {
      this.router.navigate([EventsRoutesPath.PATH_TO_LIST]);
      return EMPTY;
    }

    const id = route.paramMap.get('id');

    return this.eventsService.getEventById(+id).pipe(
      take(1),
      mergeMap(event => {
        if (event) {
          return of(event);
        } else { // id not found
          this.router.navigate([EventsRoutesPath.PATH_TO_LIST]);
          return EMPTY;
        }
      })
    );
  }

}
