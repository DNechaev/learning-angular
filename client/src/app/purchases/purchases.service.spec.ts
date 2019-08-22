import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PurchasesService } from './purchases.service';
import {Purchase, PurchaseAdapter} from '../core/purchase.model';
import { URL_API_EVENTS } from '../core/consts';

describe('PurchasesService', () => {
  let injector: TestBed;
  let service: PurchasesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PurchasesService]
    });
    injector = getTestBed();
    service = injector.get(PurchasesService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('get purchase by id', () => {

    const serverPurchase = {
      id: 1,
      name: 'Purchase',
      dateBegin: '2019-01-01T01:01:01',
      dateEnd: '2019-01-01T01:01:01',
      price: 100,
      ticketsCount: 10
    };
    const expectPurchase = (new PurchaseAdapter()).input(serverPurchase);
    // returnPurchase.id = 1;
    // returnPurchase.name = 'Purchase';
    // const returnPurchase = new Purchase(1, );

    service.getPurchaseById(1).subscribe(purchase => {
      expect(purchase).toEqual(expectPurchase);
    });

    httpMock.expectOne(r => r.url.match(URL_API_EVENTS + '/1') && r.method === 'GET')
      .flush(serverPurchase);
  });

  it('get purchase by id (error test)', () => {
    const mockErrorResponse = { status: 404, statusText: 'Not found' };
    const data = {message: 'Invalid request parameters'};

    service.getPurchaseById(1).subscribe(purchase => {
      expect(true).toBe(false);
    }, err => {
      expect(err.error).toEqual(data);
    });

    httpMock.expectOne(r => r.url.match(URL_API_EVENTS + '/1') && r.method === 'GET')
      .flush(data, mockErrorResponse);
  });

  it('get purchases', () => {
    const returnPage = {
      count: 17,
      pageSize: 15,
      page: 2,
      rows: [
        {
          id: 1,
          name: 'Purchase1'
        }, {
          id: 2,
          name: 'Purchase2'
        }
      ]
    };

    service.getPurchases({filter: 'FilterString'}, 2, 15).subscribe(page => {
      expect(page).toEqual(returnPage);
    });

    const req = httpMock.expectOne(r => r.url.match( URL_API_EVENTS ) && r.method === 'GET');
    expect(req.request.params.get('filter')).toBe('FilterString');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('15');
    req.flush(returnPage);
  });

  it('create purchase', () => {
    const purchase = new Purchase(1, 'Purchase', new Date(), new Date(), 100, 10);
    // purchase.id = 1;
    // purchase.name = 'Purchase';

    service.createPurchase(purchase).subscribe(returnPurchase => {
      expect(purchase).toEqual(returnPurchase);
    });

    httpMock.expectOne(r => r.url.match( URL_API_EVENTS ) && r.method === 'POST')
      .flush(purchase);
  });

  it('update purchase', () => {
    const purchase = new Purchase(1, 'Purchase1', new Date(), new Date(), 100, 10);
    // const purchase = new Purchase();
    // purchase.id = 1;
    // purchase.name = 'Purchase1';

    service.updatePurchase(10, purchase).subscribe(returnPurchase => {
      expect(purchase).toEqual(returnPurchase);
    });

    httpMock.expectOne(r => r.url.match(URL_API_EVENTS + '/10') && r.method === 'PUT')
      .flush(purchase);
  });

  it('delete purchase', () => {
    service.deletePurchase(10).subscribe(ans => {
      expect(ans).toEqual({});
    });

    httpMock.expectOne(r => r.url.match(URL_API_EVENTS + '/10') && r.method === 'DELETE')
      .flush({});
  });

});


