import { getTestBed, TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let injector: TestBed;
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ToastService]
    });
    injector = getTestBed();
    service = injector.get(ToastService);

  });

  it('show',   () => {

    const shouldToasts = [];

    shouldToasts.push(new Object({textOrTpl: 'Toast1'}));
    shouldToasts.push(new Object({textOrTpl: 'Toast2'}));

    service.show('Toast1');
    service.show('Toast2');

    expect(service.toasts).toEqual(shouldToasts);

  });

  it('remove',   () => {

    const shouldToasts = [];
    shouldToasts.push(new Object({textOrTpl: 'Toast2'}));

    service.show('Toast1');
    service.show('Toast2');

    service.remove(service.toasts[0]);

    expect(service.toasts).toEqual(shouldToasts);

  });

});
