import { getTestBed, TestBed } from '@angular/core/testing';

import { EventsResolverService } from './events-resolver.service';
import { EventsService } from './events.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Event } from '../core/event.model';
import { URL_API_EVENTS } from '../core/consts';

describe('EventsResolverService', () => {
  let injector: TestBed;
  let service: EventsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventsService]
    });
    injector = getTestBed();
    service = injector.get(EventsService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get event by id', () => {
    const returnEvent = new Event(1, 'Event', new Date(), new Date(), 100, 10);
    // returnEvent.id = 1;
    // returnEvent.name = 'Event';

    service.getEventById(1).subscribe(event => {
      expect(event).toEqual(returnEvent);
    });

    httpMock.expectOne(r => r.url.match(URL_API_EVENTS + '/1') && r.method === 'GET')
      .flush(returnEvent);
  });

});
