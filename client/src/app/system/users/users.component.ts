import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [ AuthenticationService ]
})
export class UsersComponent implements OnInit {

  currentUser;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.authenticationService.currentUser.subscribe((user) => {
      console.log('[UsersComponent] currentUser', user);
      this.currentUser = user;
    });
  }

}
