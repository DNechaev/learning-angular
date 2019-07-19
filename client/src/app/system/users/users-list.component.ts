import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Role } from '../../shared/models/role.model';
import { User } from '../../shared/models/user.model';
import { UsersService } from '../../shared/services/users.service';
import { map } from 'rxjs/operators';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';

@Component({
  selector: 'app-users',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  providers: [ UsersService ]
})
export class UsersListComponent implements OnInit {

  users: User[];
  totalRecords = 0;
  currentPage  = 1;
  pageSize     = 10;
  access       = false;
  isLoading    = false;
  actionUrl    = '/system/users';
  searchString = '';

  private authorizedUser;

  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UsersService,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService
  ) { }

  ngOnInit() {

    this.authorizedUser = this.authenticationService.currentUserValue;
    this.access         = this.authenticationService.checkAccess(this.authorizedUser, [Role.ADMIN]);
    this.searchService.set(this.searchString);

    this.loadData();

    this.authenticationService.currentUser.subscribe((user) => {
      console.log('[UsersListComponent] currentUser', user);
      this.authorizedUser = user;
      this.access         = this.authenticationService.checkAccess(this.authorizedUser, [Role.ADMIN]);
    });

    this.loaderIndicatorService.subject.subscribe((isLoading) => {
      console.log('[UsersListComponent] isLoading', isLoading);
      this.isLoading = isLoading;
    });

    this.searchService.subject.subscribe((searchString) => {
      console.log('[UsersListComponent] searchString', searchString);
      this.searchString = searchString;
      this.loadData();
    });

  }

  onPageChange(gotoPage: number) {
    console.log(gotoPage);
    this.currentPage = gotoPage;
    this.loadData(gotoPage);
  }

  loadData(page: number = this.currentPage) {
    this.usersService.list(this.searchString, page, this.pageSize )
      .pipe(
        map((pageData) => {
          this.totalRecords = pageData.count;
          this.pageSize     = pageData.pageSize;
          return pageData.rows;
        })
      ).subscribe(
      users => {
          this.users = users;
        },
      error => {
          console.log(error);
          // alert(error);
        }
    );
  }

  onDelete(user: User) {
    console.log(user);
    if (confirm(`Delete user: ${user.email}?`)) {
      this.usersService.delete(user.id).subscribe(
        () => {
          this.loadData();
        },
        error => {
          console.log(error);
          // alert('Something broke, see the console.');
          this.loadData();
      });
    }
  }

}
