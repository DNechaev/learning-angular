import {protractor, browser, by, element, ElementFinder, promise} from 'protractor';

export class Base {

  navigateToHome(): promise.Promise<any> {
    return browser.get('/');
  }

  navigateToLogin(): promise.Promise<any> {
    return browser.get('/auth/login');
  }

  navigateToLogout(): promise.Promise<any> {
    return browser.get('/auth/logout');
  }

  clearFieldValue(css: string) {
    const elem = element(by.css(css));
    elem.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
    return elem.sendKeys(protractor.Key.DELETE) as Promise<void>;
  }

  setFieldValue(css: string, value: string) {
    return element(by.css(css)).sendKeys(value) as Promise<void>;
  }

  getFieldValue(css: string) {
    return element(by.css(css)).getAttribute('value') as Promise<string>;
  }

  elementExist(css: string) {
    return element(by.css(css)).isPresent() as Promise<boolean>;
  }

  elementIsEnabled(css: string) {
    return element(by.css(css)).isEnabled() as Promise<boolean>;
  }

  elementClick(css: string) {
    return element(by.css(css)).click() as Promise<void>;
  }

  elementSendTab(css: string) {
    return element(by.css(css)).sendKeys(protractor.Key.TAB) as Promise<void>;
  }

  getSearchInput(): ElementFinder {
    return element(by.css('app-search input'));
  }

  async setSearchValue(value: string): Promise<void> {
    await this.clearFieldValue('app-search input');
    return this.setFieldValue('app-search input', value);
  }

  getAccessWarningElement(): ElementFinder {
    return element(by.css('#content_access'));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loginAsAdmin() {
    if ((await browser.getCurrentUrl()).includes('/auth/login')) {
      await this.setFieldValue('#inputEmail', 'admin@test.com');
      await this.elementSendTab('#inputEmail');
      await this.setFieldValue('#inputPassword', '123456');
      await this.elementSendTab('#inputPassword');
      await this.elementClick('#formGroupSubmit button[type="submit"]');
    }
    expect(browser.getCurrentUrl()).not.toContain('/auth/login');
  }

  async loginAsManager() {
    if ((await browser.getCurrentUrl()).includes('/auth/login')) {
      await this.setFieldValue('#inputEmail', 'manager@test.com');
      await this.elementSendTab('#inputEmail');
      await this.setFieldValue('#inputPassword', '123456');
      await this.elementSendTab('#inputPassword');
      await this.elementClick('#formGroupSubmit button[type="submit"]');
    }
    expect(browser.getCurrentUrl()).not.toContain('/auth/login');
  }

  async loginAsUser() {
    if ((await browser.getCurrentUrl()).includes('/auth/login')) {
      await this.setFieldValue('#inputEmail', 'user1@test.com');
      await this.elementSendTab('#inputEmail');
      await this.setFieldValue('#inputPassword', '123456');
      await this.elementSendTab('#inputPassword');
      await this.elementClick('#formGroupSubmit button[type="submit"]');
    }
    expect(browser.getCurrentUrl()).not.toContain('/auth/login');
  }

}
