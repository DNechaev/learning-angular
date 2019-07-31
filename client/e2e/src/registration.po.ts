import { browser, by, element } from 'protractor';

export class RegistrationPage {

  navigateTo(path: string = '') {
    return browser.get(browser.baseUrl + path) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

  setFieldValue(css: string, value: string) {
    element(by.css(css)).sendKeys(value);
  }

  getFieldValue(css: string) {
    return element(by.css(css)).getAttribute('value') as Promise<string>;
  }

  elementExist(css: string) {
    return element(by.css(css)).isPresent() as Promise<boolean>;
  }

  elementClick(css: string) {
    return element(by.css(css)).click() as Promise<void>;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
