import {Component, Injectable, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';

@Injectable()
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [AuthenticationService]
})
export class RegistrationComponent implements OnInit {

  currentUser;
  form: FormGroup;
  error;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {

    this.currentUser = this.authenticationService.currentUserValue;

    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(4)]),
      'name': new FormControl(null, [Validators.required, Validators.minLength(4)]),
    });

    this.authenticationService.currentUser.subscribe((user) => {
       this.currentUser = user;
    });
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

  // onTest() {
  //  this.authenticationService.checkAccess(this.currentUser);
  // }

}
