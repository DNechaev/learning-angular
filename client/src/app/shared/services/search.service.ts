import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {

  subject: BehaviorSubject<string>;

  constructor() {
    this.subject = new BehaviorSubject<string>('');
  }

  set(value: string) {
    this.subject.next(value);
  }

  get() {
    return this.subject.value;
  }

}
