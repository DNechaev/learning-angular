import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderIndicatorService {

  loader$: BehaviorSubject<boolean>;

  constructor() {
    this.loader$ = new BehaviorSubject<boolean>(false);
  }

  status(): boolean {
    return this.loader$.value;
  }

  enable() {
    this.loader$.next(true);
  }

  disable() {
    this.loader$.next(false);
  }

}
