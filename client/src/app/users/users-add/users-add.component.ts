import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { UsersService } from '../users.service';
import { Role } from '../../shared/models/role.model';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';
import {SearchService} from '../../shared/services/search.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-users-add',
  templateUrl: './users-add.component.html',
  styleUrls: ['./users-add.component.scss']
})
export class UsersAddComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  authorizedUser: User;
  access       = false;
  isLoading    = false;

  userForm: FormGroup;
  error;

  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UsersService,
    private router: Router,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
  ) {}

  ngOnInit() {

    console.log('[UsersAddComponent] ++++ngOnInit++++');

    this.searchService.disable();

    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((user: User) => {
        console.log('[UsersAddComponent] authorizedUser', user);
        this.authorizedUser = user;
        this.access = this.authenticationService.checkAccess(this.authorizedUser, [Role.ADMIN]);
      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.subject.subscribe((isLoading) => {
        console.log('[UsersAddComponent] isLoading', isLoading);
        this.isLoading = isLoading;
      })
    );

    this.userForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    });

  }

  ngOnDestroy() {
    console.log('[UsersAddComponent] ----ngOnDestroy----');
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }

  onSubmit(user: User) {
    console.log('User: ', user);
    this.usersService.createUser(user).subscribe(
      (data) => {
        this.router.navigate(['/users']);
      },
      error => {
        console.error(error);
      });
  }

}

