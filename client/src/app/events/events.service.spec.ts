import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EventsService } from './events.service';
import { Event } from '../core/event.model';
import { URL_API_EVENTS } from '../core/consts';

describe('EventsService', () => {
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

  it('get event by id', () => {
    const returnEvent = { id: 1, name: 'Event' };
    // returnEvent.id = 1;
    // returnEvent.name = 'Event';

    service.getEventById(1).subscribe(event => {
      expect(event).toEqual(returnEvent);
    });

    httpMock.expectOne(r => r.url.match(URL_API_EVENTS + '/1') && r.method === 'GET')
      .flush(returnEvent);
  });

  it('get event by id (error test)', () => {
    const mockErrorResponse = { status: 404, statusText: 'Not found' };
    const data = {message: 'Invalid request parameters'};

    service.getEventById(1).subscribe(event => {
      expect(true).toBe(false);
    }, err => {
      expect(err.error).toEqual(data);
    });

    httpMock.expectOne(r => r.url.match(URL_API_EVENTS + '/1') && r.method === 'GET')
      .flush(data, mockErrorResponse);
  });

  it('get events', () => {
    const returnPage = {
      count: 17,
      pageSize: 15,
      page: 2,
      rows: [
        {
          id: 1,
          name: 'Event1'
        }, {
          id: 2,
          name: 'Event2'
        }
      ]
    };

    service.getEvents('FilterString', 2, 15).subscribe(page => {
      expect(page).toEqual(returnPage);
    });

    const req = httpMock.expectOne(r => r.url.match( URL_API_EVENTS ) && r.method === 'GET');
    expect(req.request.params.get('filter')).toBe('FilterString');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('15');
    req.flush(returnPage);
  });

  it('create event', () => {
    const event = new Event(1, 'Event', new Date(), new Date(), 100, 10);
    // event.id = 1;
    // event.name = 'Event';

    service.createEvent(event).subscribe(returnEvent => {
      expect(event).toEqual(returnEvent);
    });

    httpMock.expectOne(r => r.url.match( URL_API_EVENTS ) && r.method === 'POST')
      .flush(event);
  });

  it('update event', () => {
    const event = new Event(1, 'Event1', new Date(), new Date(), 100, 10);
    // const event = new Event();
    // event.id = 1;
    // event.name = 'Event1';

    service.updateEvent(10, event).subscribe(returnEvent => {
      expect(event).toEqual(returnEvent);
    });

    httpMock.expectOne(r => r.url.match(URL_API_EVENTS + '/10') && r.method === 'PUT')
      .flush(event);
  });

  it('delete event', () => {
    service.deleteEvent(10).subscribe(ans => {
      expect(ans).toEqual({});
    });

    httpMock.expectOne(r => r.url.match(URL_API_EVENTS + '/10') && r.method === 'DELETE')
      .flush({});
  });

});


