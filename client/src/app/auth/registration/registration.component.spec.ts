import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import {Router, RouterModule} from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {of} from 'rxjs';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let router: Router;
  let authenticationService: AuthenticationService;
  let spyAuthenticationRegistration: jasmine.Spy;
  let spyRoute: jasmine.Spy;
  let mockUser;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [ RegistrationComponent ],
      providers: [ AuthenticationService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;

    authenticationService = fixture.debugElement.injector.get(AuthenticationService);
    router = fixture.debugElement.injector.get(Router);
    mockUser = {
      id: 10,
      name: 'User',
      ssid: 'TEST_SSID'
    };
    spyAuthenticationRegistration = spyOn(authenticationService, 'registration').and.returnValue(of(mockUser));
    spyRoute = spyOn(router, 'navigate').and.returnValue(new Promise((resolve) => resolve(true)));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit by no valid form', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should submit', () => {
    component.form.patchValue({
      name: 'Test User',
      email: 'test@test.com',
      password: '1234567890'
    });
    component.onSubmit();
    expect(spyAuthenticationRegistration.calls.any()).toBeTruthy();
    expect(spyRoute.calls.any()).toBeTruthy();
  });

});
