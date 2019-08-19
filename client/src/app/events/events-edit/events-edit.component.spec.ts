import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EventsEditComponent } from './events-edit.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { EventsService } from '../events.service';
import { Event } from '../../core/event.model';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';

describe('EventsEditComponent', () => {
  let component: EventsEditComponent;
  let fixture: ComponentFixture<EventsEditComponent>;

  let authenticationService: AuthenticationService;
  let eventsService: EventsService;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let loaderIndicatorService: LoaderIndicatorService;
  let searchService: SearchService;
  let toastService: ToastService;

  let spyEventsUpdate: jasmine.Spy;
  let spyRoute: jasmine.Spy;

  const mockEvent = new Event(1, 'Event', new Date(), new Date(), 100, 10);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ReactiveFormsModule
      ],
      declarations: [ EventsEditComponent ],
      providers: [
        EventsService,
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ event: mockEvent } )
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsEditComponent);
    component = fixture.componentInstance;

    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    router = fixture.debugElement.injector.get(Router);
    authenticationService = fixture.debugElement.injector.get(AuthenticationService);
    eventsService = fixture.debugElement.injector.get(EventsService);
    loaderIndicatorService = fixture.debugElement.injector.get(LoaderIndicatorService);
    searchService = fixture.debugElement.injector.get(SearchService);
    toastService = fixture.debugElement.injector.get(ToastService);

    spyEventsUpdate = spyOn( eventsService, 'updateEvent' ).and.returnValue(of(mockEvent));
    spyRoute = spyOn( router, 'navigate' ).and.returnValue(new Promise((resolve) => resolve(true)));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should event loaded', () => {
    expect(component.eventLoaded).toBe(true);
  });

  it('should not submit by no valid form', () => {
    expect(component.eventForm.valid).toBe(false);
  });

  it('should submit', () => {
    component.eventForm.patchValue({
      name: 'Test Event',
      email: 'test@test.com',
      password: '1234567890',
      roles: [ false, true, true ]
    });
    component.onSubmit();
    expect(spyEventsUpdate.calls.any()).toBeTruthy();
    expect(spyRoute.calls.any()).toBeTruthy();
  });

});
