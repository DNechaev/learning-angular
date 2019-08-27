import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PurchasesEditComponent } from './purchases-edit.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PurchasesService } from '../purchases.service';
import { Purchase } from '../../core/purchase.model';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';

describe('PurchasesEditComponent', () => {
  let component: PurchasesEditComponent;
  let fixture: ComponentFixture<PurchasesEditComponent>;

  let authenticationService: AuthenticationService;
  let purchasesService: PurchasesService;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let loaderIndicatorService: LoaderIndicatorService;
  let searchService: SearchService;
  let toastService: ToastService;

  let spyPurchasesUpdate: jasmine.Spy;
  let spyRoute: jasmine.Spy;

  const mockPurchase = new Purchase(1, new Date(), 1, 2, 100);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ReactiveFormsModule
      ],
      declarations: [ PurchasesEditComponent ],
      providers: [
        PurchasesService,
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ purchase: mockPurchase } )
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesEditComponent);
    component = fixture.componentInstance;

    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    router = fixture.debugElement.injector.get(Router);
    authenticationService = fixture.debugElement.injector.get(AuthenticationService);
    purchasesService = fixture.debugElement.injector.get(PurchasesService);
    loaderIndicatorService = fixture.debugElement.injector.get(LoaderIndicatorService);
    searchService = fixture.debugElement.injector.get(SearchService);
    toastService = fixture.debugElement.injector.get(ToastService);

    spyPurchasesUpdate = spyOn( purchasesService, 'updatePurchase' ).and.returnValue(of(mockPurchase));
    spyRoute = spyOn( router, 'navigate' ).and.returnValue(new Promise((resolve) => resolve(true)));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should purchase loaded', () => {
    expect(component.purchaseLoaded).toBe(true);
  });

  it('should not submit by no valid form', () => {
    component.purchaseForm.patchValue({name: ''});
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
    expect(spyPurchasesUpdate.calls.any()).toBeTruthy();
    expect(spyRoute.calls.any()).toBeTruthy();
  });

});
