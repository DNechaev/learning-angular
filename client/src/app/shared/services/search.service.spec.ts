import { getTestBed, TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';
import {User} from "../models";

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

  it('by default service must be activated',   async () => {
    expect(await service.isActive()).toBe(true);
  });

  it('disable service',   async () => {
    await service.disable();
    expect(await service.isActive()).toBe(false);
  });

  it('enable service',   async () => {
    await service.disable();
    await service.enable();
    expect(await service.isActive()).toBe(true);
  });

  it('get search value',   async () => {
    await service.enable();
    const value = service.get();
    expect(value).toBe('');
  });

  it('set search value',   async () => {
    await service.enable();
    await service.set('TEST');
    const value = service.get();
    expect(value).toBe('TEST');
  });

  it('get disabled search value',   async () => {
    await service.enable();
    await service.set('TEST');
    const value1 = service.get();
    expect(value1).toBe('TEST');
    await service.disable();
    const value2 = service.get();
    expect(value2).toBe('');
  });

  it('subscribe on search value changes',  async () => {

    let testString: string = '';

    service.search.subscribe(s => {
      testString = s;
    });


    await service.set('TEST1');
    expect(testString).toBe('TEST1');

    await service.set('TEST2');
    expect(testString).toBe('TEST2');

    await service.set('TEST3');
    expect(testString).toBe('TEST3');

    await service.disable();

    await service.set('TEST4');
    expect(testString).toBe('TEST3');

    await service.enable();

    await service.set('TEST5');
    expect(testString).toBe('TEST5');

  });

  it('subscribe on active value changes',  async () => {

    let testValue = false;

    service.active.subscribe(b => {
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
