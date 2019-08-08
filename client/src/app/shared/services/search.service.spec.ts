import { getTestBed, TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let injector: TestBed;
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [SearchService]
    });
    injector = getTestBed();
    service = injector.get(SearchService);
  });

  it('by default service must be activated',    () => {
    expect(service.isActive()).toBe(true);
  });

  it('disable service', () => {
    service.disable();
    expect(service.isActive()).toBe(false);
  });

  it('enable service',  () => {
    service.disable();
    service.enable();
    expect(service.isActive()).toBe(true);
  });

  it('get search value', () => {
    service.enable();
    const value = service.get();
    expect(value).toBe('');
  });

  it('set search value', () => {
    service.enable();
    service.set('TEST');
    const value = service.get();
    expect(value).toBe('TEST');
  });

  it('get enable search value', () => {
    service.enable();
    service.set('TEST');
    const value = service.get();
    expect(value).toBe('TEST');
  });

  it('get disabled search value', () => {
    service.disable();
    service.set('TEST');
    const value = service.get();
    expect(value).toBe('');
  });

  it('subscribe on search value changes', () => {
    let testString = '';
    service.search$.subscribe(s => {
      testString = s;
    });
    service.set('TEST');
    expect(testString).toBe('TEST');
  });

  it('subscribe on search value changes (disabled)', () => {
    let testString = '';
    service.search$.subscribe(s => {
      testString = s;
    });
    service.set('TEST1');
    service.disable();
    service.set('TEST2');
    expect(testString).toBe('TEST1'); // Old value
  });

  it('subscribe on search value changes (enabled)', () => {
    let testString = '';
    service.search$.subscribe(s => {
      testString = s;
    });
    service.set('TEST1');
    service.disable();
    service.set('TEST2');
    service.enable();
    service.set('TEST3');
    expect(testString).toBe('TEST3');
  });

  it('subscribe on active value changes', () => {
    let testValue = false;
    service.active$.subscribe(b => {
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
