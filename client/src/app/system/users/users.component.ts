import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Role } from '../../shared/models/role.model';
import { User } from '../../shared/models/user.model';
import { UsersService } from '../../shared/services/users.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [ UsersService ]
})
export class UsersComponent implements OnInit {

  closeResult: string;

  private access = false;
  private currentUser;
  private users: User[];

  private totalRecords = 0;
  private currentPage = 1;
  private pageSize = 10;

  constructor(private authenticationService: AuthenticationService, private usersService: UsersService) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.access      = this.authenticationService.checkAccess(this.currentUser, [Role.ADMIN]);
    this.authenticationService.currentUser.subscribe((user) => {
      console.log('[UsersComponent] currentUser', user);
      this.currentUser = user;
      this.access      = this.authenticationService.checkAccess(this.currentUser, [Role.ADMIN]);
    });
    this.loadData();
  }

  onPageChange(gotoPage: number) {
    console.log(gotoPage);
    this.currentPage = gotoPage;
    this.loadData(gotoPage);
  }

  loadData(page: number = this.currentPage) {
    this.usersService.list('', page, this.pageSize )
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
        alert(error);
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
          alert('Something broke, see the console.');
          this.loadData();
      });
    }
  }


}
