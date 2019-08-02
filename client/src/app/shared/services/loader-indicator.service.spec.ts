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

  it('by default loader must be false',   async () => {
    expect(await service.subject.value).toBe(false);
  });

  it('disable service',   async () => {
    await service.disable();
    expect(await service.subject.value).toBe(false);
  });

  it('enable service',   async () => {
    await service.disable();
    await service.enable();
    expect(await service.subject.value).toBe(true);
  });

  it('subscribe on indicator value changes',  async () => {

    let testValue = false;

    service.subject.subscribe(b => {
      testValue = b;
    });

    await service.enable();
    expect(testValue).toBe(true);

    await service.disable();
    expect(testValue).toBe(false);

    await service.enable();
    expect(testValue).toBe(true);

  });

});
