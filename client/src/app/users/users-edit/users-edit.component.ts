import { Component, OnInit } from '@angular/core';
import {SearchService} from '../../shared/services/search.service';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit {

  constructor(
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.searchService.disable();
  }

}
