import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { of } from 'rxjs';
import {HttpClientModule} from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authenticationService: AuthenticationService;
  let spy: jasmine.Spy;
  let spyRoute: jasmine.Spy;
  let mockUser;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ReactiveFormsModule
      ],
      declarations: [ LoginComponent ],
      providers: [ AuthenticationService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authenticationService = fixture.debugElement.injector.get(AuthenticationService);
    router = fixture.debugElement.injector.get(Router);
    mockUser = {
      id: 10,
      name: 'User',
      ssid: 'TEST_SSID'
    };
    spy = spyOn(authenticationService, 'login').and.returnValue(of(mockUser));
    spyRoute = spyOn(router, 'navigate').and.returnValue(new Promise(() => true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit by no valid form', () => {
    expect(component.onSubmit()).toBe(false);
  });

  it('should submit', () => {
    component.formLogin.patchValue({
      email: 'test@test.com',
      password: '1234567890'
    });
    component.onSubmit();
    expect(spy.calls.any()).toBeTruthy();
    expect(spyRoute.calls.any()).toBeTruthy();
  });

});
