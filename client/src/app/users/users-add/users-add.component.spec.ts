import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UsersAddComponent } from './users-add.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { UsersService } from '../users.service';
import { User } from '../../shared/models';

describe('UsersAddComponent', () => {
  let component: UsersAddComponent;
  let fixture: ComponentFixture<UsersAddComponent>;

  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let loaderIndicatorService: LoaderIndicatorService;
  let searchService: SearchService;
  let toastService: ToastService;

  let spyUsersAdd: jasmine.Spy;
  let spyRoute: jasmine.Spy;

  const mockUser = new User();
  mockUser.id = 1;
  mockUser.name = 'User';
  mockUser.email = 'Email';
  mockUser.roles = [
    { id: 2, name: 'MANAGER' },
    { id: 3, name: 'USER' },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ReactiveFormsModule
      ],
      declarations: [ UsersAddComponent ],
      providers: [
        UsersService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAddComponent);
    component = fixture.componentInstance;

    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    router = fixture.debugElement.injector.get(Router);
    authenticationService = fixture.debugElement.injector.get(AuthenticationService);
    usersService = fixture.debugElement.injector.get(UsersService);
    loaderIndicatorService = fixture.debugElement.injector.get(LoaderIndicatorService);
    searchService = fixture.debugElement.injector.get(SearchService);
    toastService = fixture.debugElement.injector.get(ToastService);

    spyUsersAdd = spyOn( usersService, 'createUser' ).and.returnValue(of(mockUser));
    spyRoute = spyOn( router, 'navigate' ).and.returnValue(new Promise((resolve) => resolve(true)));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit by no valid form', () => {
    expect(component.userForm.valid).toBe(false);
  });

  it('should submit', () => {
    component.userForm.patchValue({
      name: 'Test User',
      email: 'test@test.com',
      password: '1234567890',
      roles: [ false, true, true ]
    });
    component.onSubmit();
    expect(spyUsersAdd.calls.any()).toBeTruthy();
    expect(spyRoute.calls.any()).toBeTruthy();
  });

});
