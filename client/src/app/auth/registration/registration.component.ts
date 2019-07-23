import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: []
})
export class RegistrationComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  authorizedUser;
  form: FormGroup;
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
          this.router.navigate(['/users']);
        },
        error => {
          this.error = error.error;
        });
  }

}
