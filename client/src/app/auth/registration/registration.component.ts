import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthRoutesPath } from '../auth.routing';
import { AppRoutesPath } from 'src/app/app-routing.module';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  authorizedUser;
  form: FormGroup;
  error;
  authRoute = {
    home: AppRoutesPath.HOME,
    login:  AuthRoutesPath.PATH_TO_LOGIN,
    logout: AuthRoutesPath.PATH_TO_LOGOUT,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {

    this.subscription = this.authenticationService.currentUser$.subscribe((user) => {
      this.authorizedUser = user;
    });

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  onSubmit() {
    this.authenticationService.registration(this.form.value.email, this.form.value.password, this.form.value.name)
      .subscribe(
        data => {
          this.router.navigate([ this.authRoute.home ]);
        },
        error => {
          this.error = error.error;
        });
  }

}
