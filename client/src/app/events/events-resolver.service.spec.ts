import { getTestBed, TestBed } from '@angular/core/testing';

import { EventsResolverService } from './events-resolver.service';
import { EventsService } from './events.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {Event, EventAdapter} from '../core/event.model';
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
    const serverEvent = {
      id: 1,
      name: 'Event',
      dateBegin: '2019-01-01T01:01:01',
      dateEnd: '2019-01-01T01:01:01',
      price: 100,
      ticketsCount: 10
    };
    const expectEvent = (new EventAdapter()).input(serverEvent);

    service.getEventById(1).subscribe(event => {
      expect(event).toEqual(expectEvent);
    });

    httpMock.expectOne(r => r.url.match(URL_API_EVENTS + '/1') && r.method === 'GET')
      .flush(serverEvent);
  });

});
