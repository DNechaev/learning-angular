import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: []
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  authorizedUser;
  form: FormGroup;
  returnUrl: string;
  error;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {

    this.subscription = this.authenticationService.currentUser.subscribe((user) => {
        this.authorizedUser = user;
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      remember: new FormControl( false )
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  onSubmit() {
    this.authenticationService.login(this.form.value.email, this.form.value.password, this.form.value.remember)
      .subscribe(
        data => {
          console.log('[LoginComponent] login.data', data);
          this.router.navigate([this.returnUrl]);
        },
        error => {
          console.log('[LoginComponent] login.error', error);
          this.error = error.error;
        });
  }

}
