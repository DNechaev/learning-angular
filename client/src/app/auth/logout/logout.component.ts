import {Component, Injectable, OnInit} from '@angular/core';
import {AuthenticationService} from 'src/app/shared/services/authentication.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-logout',
  template: '',
  // styleUrls: ['./login.component.scss'],
  providers: []
})
export class LogoutComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.authenticationService.logout();
    console.log('[LogoutComponent]');
    this.router.navigate(['auth/login']);
  }

}
