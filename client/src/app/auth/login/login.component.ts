import {Component, Injectable, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';

@Injectable()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: []
})
export class LoginComponent implements OnInit {

  currentUser;
  form: FormGroup;
  returnUrl: string;
  error;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {

    this.currentUser = this.authenticationService.currentUserValue;
    this.authenticationService.currentUser.subscribe((user) => {
      console.log('[LoginComponent] currentUser', user);
      this.currentUser = user;
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(4)]),
    });

  }

  onSubmit() {
    this.authenticationService.login(this.form.value.email, this.form.value.password)
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
