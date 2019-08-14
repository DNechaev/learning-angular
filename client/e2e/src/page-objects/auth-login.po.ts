import { browser, by, element, promise } from 'protractor';
import { Base } from './base.po';

export class AuthLogin extends Base {

  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

}
