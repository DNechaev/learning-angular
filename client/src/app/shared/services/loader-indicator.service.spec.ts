import { getTestBed, TestBed } from '@angular/core/testing';
import { LoaderIndicatorService } from './loader-indicator.service';

describe('LoaderIndicatorService', () => {
  let injector: TestBed;
  let service: LoaderIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [LoaderIndicatorService]
    });
    injector = getTestBed();
    service = injector.get(LoaderIndicatorService);
  });

  it('by default loader must be false', () => {
    expect(service.status()).toBe(false);
  });

  it('disable service', () => {
    service.disable();
    expect(service.status()).toBe(false);
  });

  it('enable service', () => {
    service.disable();
    service.enable();
    expect(service.status()).toBe(true);
  });

  it('subscribe on indicator value changes',  () => {

    let testValue = false;

    service.loader$.subscribe(b => {
      testValue = b;
    });

    service.enable();
    expect(testValue).toBe(true);

    service.disable();
    expect(testValue).toBe(false);

    service.enable();
    expect(testValue).toBe(true);

  });

});
