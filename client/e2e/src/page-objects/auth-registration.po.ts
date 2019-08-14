import { browser, by, element, promise } from 'protractor';
import { Base } from './base.po';

export class AuthRegistration extends Base {

  navigateToRegistration(): promise.Promise<any> {
    return browser.get('/auth/registration');
  }

  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

}
