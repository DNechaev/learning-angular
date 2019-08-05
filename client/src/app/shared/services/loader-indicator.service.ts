import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderIndicatorService {

  subject$: BehaviorSubject<boolean>;

  constructor() {
    this.subject$ = new BehaviorSubject<boolean>(false);
  }

  enable() {
    this.subject$.next(true);
  }

  disable() {
    this.subject$.next(false);
  }

}
