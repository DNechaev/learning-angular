import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Role } from '../../core/enums';
import { User } from '../../core/user.model';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { UsersService } from '../users.service';
// import { AuthenticationService } from '../../auth/services/authentication.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { UsersRoutesPath } from '../users.routing';
import { AppRoutesPath } from '../../app-routing.module';
import { CurrentUserProvider } from '../../shared/providers/current-user.provider';

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
    { id: 2, name: Role.MANAGER },
    { id: 3, name: Role.USER },
  ];

  urls = {
    home: AppRoutesPath.HOME,
    users: UsersRoutesPath.PATH_TO_LIST,
  };

  constructor(
    // private authenticationService: AuthenticationService,
    private currentUserProvider: CurrentUserProvider,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
  ) {}

  private static getRoleIdsFromRoles(roles: any[]): number[] {
    return roles
      .map((v) => v ? v.id : null)
      .filter(v => v !== null);
  }

  ngOnInit() {

    this.searchService.disable();

    this.subscriptions.push(
      this.currentUserProvider.currentUser$.subscribe(( user: User ) => {
        this.authorizedUser = user;
        this.access = this.currentUserProvider.userHasRoles(this.authorizedUser, [Role.ADMIN]);
      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.loader$.subscribe(( isLoading ) => {
        this.isLoading = isLoading;
      })
    );

    this.createForm();

    this.activatedRoute.data
      .subscribe((data: { user: User }) => {
        this.applyUser(data.user);
      });
  }

  ngOnDestroy() {
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }

  onSubmit() {
    const user = this.userForm.value;
    if (!this.userLoaded) {
      return this.toastService.warning('User won\'t loaded');
    }
    user.roles = this.getSelectedRoleIds(user.roles);
    this.usersService.updateUser(this.userId, user).subscribe(
      (data) => {
        this.toastService.success('User updated!');
        this.router.navigate([ UsersRoutesPath.PATH_TO_LIST ]);
      },
      error => {
        console.error(error);
      });
  }

  private createForm() {

    this.userForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, this.validatorEmptyOrMin(4)),
      roles: new FormArray([], this.validatorMinSelectedCheckboxes(1))
    });

    this.allRoles.map(() => {
      (this.userForm.controls.roles as FormArray).push(new FormControl(false));
    });

  }

  private validatorMinSelectedCheckboxes(min = 1): ValidatorFn {
    return (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);
      return totalSelected >= min ? null : { required: true };
    };
  }

  private validatorEmptyOrMin(min = 1): ValidatorFn {
    return  (formControl: FormControl) => {
      const valueLength = formControl.value ? formControl.value.length : 0;
      return (valueLength === 0 || valueLength >= min) ? null : { required: true };
    };
  }

  private getSelectedRoleIds(roles: any[]): number[] {
    return roles
      .map((v, i) => v ? this.allRoles[i].id : null)
      .filter(v => v !== null);
  }

  private applyUser(user: User): void {
    if (!user) { return; }

    this.toastService.success('User loaded!');
    this.userId = user.id;

    const selectedRoles = UsersEditComponent.getRoleIdsFromRoles(user.roles);

    user.roles = [];
    this.allRoles.map((o) => {
      user.roles.push(selectedRoles.includes(o.id));
    });

    this.userForm.patchValue(user);
    this.userLoaded = true;

  }

}
