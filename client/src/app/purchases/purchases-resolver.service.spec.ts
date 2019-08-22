import { getTestBed, TestBed } from '@angular/core/testing';

import { PurchasesResolverService } from './purchases-resolver.service';
import { PurchasesService } from './purchases.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {Purchase, PurchaseAdapter} from '../core/purchase.model';
import { URL_API_EVENTS } from '../core/consts';

describe('PurchasesResolverService', () => {
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

  it('should be created', () => {
    expect(service).toBeTruthy();
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

    service.getPurchaseById(1).subscribe(purchase => {
      expect(purchase).toEqual(expectPurchase);
    });

    httpMock.expectOne(r => r.url.match(URL_API_EVENTS + '/1') && r.method === 'GET')
      .flush(serverPurchase);
  });

});
