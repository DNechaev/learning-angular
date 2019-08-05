import { Component } from '@angular/core';
import { AuthRoutesPath } from '../../../auth/auth.routing';
import { UsersRoutesPath } from '../../../users/users.routing';
import { AppRoutesPath } from '../../../app-routing.module';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  routes = {
    home: AppRoutesPath.HOME,
    users: UsersRoutesPath.PATH_TO_LIST,
    logout: AuthRoutesPath.PATH_TO_LOGOUT,
  };
}
