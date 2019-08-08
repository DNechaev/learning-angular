import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { LogoutComponent } from './logout.component';
import { AuthenticationService } from '../services/authentication.service';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let router: Router;
  let authenticationService: AuthenticationService;
  let spyAuthenicationLogout: jasmine.Spy;
  let spyRoute: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule
      ],
      declarations: [ LogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);

    authenticationService = fixture.debugElement.injector.get(AuthenticationService);
    router = fixture.debugElement.injector.get(Router);

    spyAuthenicationLogout = spyOn(authenticationService, 'logout').and.returnValue(null);
    spyRoute = spyOn(router, 'navigate').and.returnValue(new Promise((resolve) => resolve(true)));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('logout', () => {
    expect(spyAuthenicationLogout.calls.any()).toBeTruthy();
  });

  it('redirect', () => {
    expect(spyRoute.calls.any()).toBeTruthy();
  });

});
