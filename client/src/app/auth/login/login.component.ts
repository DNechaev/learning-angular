import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { AuthRoutesPath } from '../auth.routing';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  authorizedUser;
  formLogin: FormGroup;
  returnUrl: string;
  error;
  authRoute = {
    registration: AuthRoutesPath.PATH_TO_REGISTRATION,
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

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

    this.formLogin = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      remember: new FormControl( false )
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  onSubmit() {
    if (!this.formLogin.valid) {
      return false;
    }
    this.authenticationService.login(this.formLogin.value.email, this.formLogin.value.password, this.formLogin.value.remember)
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          console.error('[LoginComponent] Error', error);
          this.error = error.error;
        });
    return true;
  }

}
