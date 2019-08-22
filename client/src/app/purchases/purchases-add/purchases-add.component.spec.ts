import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PurchasesAddComponent } from './purchases-add.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { PurchasesService } from '../purchases.service';
import { Purchase } from '../../core/purchase.model';

describe('PurchasesAddComponent', () => {
  let component: PurchasesAddComponent;
  let fixture: ComponentFixture<PurchasesAddComponent>;

  let authenticationService: AuthenticationService;
  let purchasesService: PurchasesService;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let loaderIndicatorService: LoaderIndicatorService;
  let searchService: SearchService;
  let toastService: ToastService;

  let spyPurchasesAdd: jasmine.Spy;
  let spyRoute: jasmine.Spy;

  const mockPurchase = new Purchase(1, 'Purchase', new Date(), new Date(), 100, 10);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ReactiveFormsModule
      ],
      declarations: [ PurchasesAddComponent ],
      providers: [
        PurchasesService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesAddComponent);
    component = fixture.componentInstance;

    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    router = fixture.debugElement.injector.get(Router);
    authenticationService = fixture.debugElement.injector.get(AuthenticationService);
    purchasesService = fixture.debugElement.injector.get(PurchasesService);
    loaderIndicatorService = fixture.debugElement.injector.get(LoaderIndicatorService);
    searchService = fixture.debugElement.injector.get(SearchService);
    toastService = fixture.debugElement.injector.get(ToastService);

    spyPurchasesAdd = spyOn( purchasesService, 'createPurchase' ).and.returnValue(of(mockPurchase));
    spyRoute = spyOn( router, 'navigate' ).and.returnValue(new Promise((resolve) => resolve(true)));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit by no valid form', () => {
    expect(component.purchaseForm.valid).toBe(false);
  });

  it('should not submit by dateBegin > dateEnd', () => {
    component.purchaseForm.patchValue({
      name: 'Test Purchase',
      dateBegin: '2019-01-01T02:00',
      dateEnd: '2019-01-01T00:00',
      price: 100,
      ticketsCount: 10
    });
    expect(component.purchaseForm.valid).toBe(false);
  });

  it('should submit', () => {
    component.purchaseForm.patchValue({
      name: 'Test Purchase',
      dateBegin: '2019-01-01T00:00',
      dateEnd: '2019-01-01T00:00',
      price: 100,
      ticketsCount: 10
    });
    component.onSubmit();
    expect(spyPurchasesAdd.calls.any()).toBeTruthy();
    expect(spyRoute.calls.any()).toBeTruthy();
  });

});
