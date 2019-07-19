import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Role } from '../../shared/models/role.model';
import { User } from '../../shared/models/user.model';
import { UsersService } from '../../shared/services/users.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss'],
  providers: [ UsersService ]
})
export class UsersFormComponent implements OnInit {

  // userId: number;
  access       = false;
  isLoading    = false;

  user: User   = new User();

  private authorizedUser;

  constructor(
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private toastService: ToastService,
    private loaderIndicatorService: LoaderIndicatorService,
  ) {}

  ngOnInit() {

    const userId = +this.activatedRoute.snapshot.paramMap.get('id');

    this.authorizedUser = this.authenticationService.currentUserValue;
    this.access         = this.authenticationService.checkAccess(this.authorizedUser, [Role.ADMIN]);

    this.loadData(userId);

    this.authenticationService.currentUser.subscribe((user) => {
      console.log('[UsersFormComponent] authorizedUser', user);
      this.authorizedUser = user;
      this.access         = this.authenticationService.checkAccess(this.authorizedUser, [Role.ADMIN]);
    });

    this.loaderIndicatorService.subject.subscribe((isLoading) => {
      console.log('[UsersFormComponent] isLoading', isLoading);
      this.isLoading = isLoading;
    });

  }

  loadData(userId: number) {
    this.usersService.get( userId )
      .subscribe(
      user => {
          this.user = user;
        },
      error => {
          console.log(error);
        }
    );
  }

}
