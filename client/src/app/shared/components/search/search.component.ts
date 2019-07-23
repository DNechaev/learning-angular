import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { SearchService } from '../../services/search.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  showPanel = true;
  private searchControl: FormControl;
  private debounce = 800;
  private subscription: Subscription;

  constructor(
    public searchService: SearchService
  ) {}

  ngOnInit() {

    this.subscription = this.searchService.active.subscribe((showPanel) => {
      this.showPanel = showPanel;
    });

    this.searchControl = new FormControl('');
    this.searchControl.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        this.searchService.set(query);
      });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription = null;
  }

}
