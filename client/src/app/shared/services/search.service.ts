import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {

  active: BehaviorSubject<boolean>;
  search: BehaviorSubject<string>;

  constructor() {
    this.active = new BehaviorSubject<boolean>(true);
    this.search = new BehaviorSubject<string>('');
  }

  set(value: string) {
    if (this.isActive()) {
      this.search.next(value);
    }
  }

  get() {
    if (this.isActive()) {
      return this.search.value;
    }
    return '';
  }

  isActive() {
    return this.active.value;
  }

  enable() {
    this.active.next(true);
  }

  disable() {
    this.active.next(false);
  }

}
