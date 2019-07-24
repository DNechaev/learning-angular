import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Role } from '../../shared/models/role.model';
import { User } from '../../shared/models/user.model';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { UsersService } from '../users.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit, OnDestroy {

  userId: number;
  subscriptions: Subscription[] = [];
  authorizedUser: User;
  access       = false;
  isLoading    = false;
  userLoaded   = false;

  userForm: FormGroup;
  allRoles = [
    { id: 1, name: Role.ADMIN },
    { id: 2, name: Role.MANGER },
    { id: 3, name: Role.USER },
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {

    console.log('[UsersEditComponent] ++++ngOnInit++++');
    this.userId = +this.activatedRoute.snapshot.paramMap.get('id');

    this.searchService.disable();

    this.subscriptions.push(
      this.authenticationService.currentUser.subscribe((user: User) => {
        console.log('[UsersEditComponent] authorizedUser', user);
        this.authorizedUser = user;
        this.access = this.authenticationService.checkAccess(this.authorizedUser, [Role.ADMIN]);
      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.subject.subscribe((isLoading) => {
        console.log('[UsersEditComponent] isLoading', isLoading);
        this.isLoading = isLoading;
      })
    );

    this.createForm();

    this.loadUser(this.userId);
  }

  ngOnDestroy() {
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }

  onSubmit(user: User) {
    if (!this.userLoaded) {
      return this.toastService.warning('User won\'t loaded');
    }
    user.roles = this.getSelectedRoleIds(this.userForm.value.roles);
    console.log('User: ', user);
    this.usersService.updateUser(this.userId, user).subscribe(
      (data) => {
        this.toastService.success('User updated!');
        this.router.navigate(['/users']);
      },
      error => {
        console.error(error);
      });
  }

  private createForm() {

    this.userForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null),
      roles: new FormArray([], (formArray: FormArray) => {
        const totalSelected = formArray.controls
          .map(control => control.value)
          .reduce((prev, next) => next ? prev + next : prev, 0);
        return totalSelected >= 1 ? null : { required: true };
      })
    });

    this.allRoles.map(() => {
      (this.userForm.controls.roles as FormArray).push(new FormControl(false));
    });

  }

  private getSelectedRoleIds(roles: any[]) {
    return roles
      .map((v, i) => v ? this.allRoles[i].id : null)
      .filter(v => v !== null);
  }

  private getRoleIdsFromRoles(roles: any[]) {
    return roles
      .map((v, i) => v ? v.id : null)
      .filter(v => v !== null);
  }

  private loadUser(userId: number) {
    console.log('userId: ', userId);
    this.usersService.getUserById(userId).subscribe(
      (data) => {
        console.log('loadUser: ', data);
        this.toastService.success('User loaded!');
        this.userId = data.id;

        const selectedRoles = this.getRoleIdsFromRoles(data.roles);
        console.log('selectedRoles: ', selectedRoles);

        data.roles = [];
        this.allRoles.map((o) => {
          data.roles.push(selectedRoles.indexOf(o.id) !== -1);
        });

        this.userForm.patchValue(data);
        this.userLoaded = true;
        console.log('userForm: ', this.userForm);
      },
      error => {
        console.error(error);
      });
  }

}
