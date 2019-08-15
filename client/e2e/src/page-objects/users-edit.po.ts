import { browser, by, element, promise, ElementFinder, ElementArrayFinder } from 'protractor';
import { Base } from './base.po';

export class UsersEdit extends Base {

  private formLocator = 'app-users-edit #content_body form ';

  getHeader(): ElementFinder {
    return element(by.css('app-users-edit #content_header h1'));
  }

  getForm(): ElementFinder {
    return element(by.css(this.formLocator));
  }

  getNameValue(): Promise<string> {
    return this.getFieldValue(this.formLocator + '#fieldName');
  }

  async setNameValue(value: string): Promise<void> {
    await this.clearFieldValue(this.formLocator + '#fieldName');
    return this.setFieldValue(this.formLocator + '#fieldName', value);
  }

  getEmailValue(): Promise<string> {
    return this.getFieldValue(this.formLocator + '#fieldEmail');
  }

  async setEmailValue(value: string): Promise<void> {
    await this.clearFieldValue(this.formLocator + '#fieldEmail');
    return this.setFieldValue(this.formLocator + '#fieldEmail', value);
  }

  getPasswordValue(): Promise<string> {
    return this.getFieldValue(this.formLocator + '#fieldPassword');
  }

  async setPasswordValue(value: string): Promise<void> {
    await this.clearFieldValue(this.formLocator + '#fieldPassword');
    return this.setFieldValue(this.formLocator + '#fieldPassword', value);
  }

  getSaveButton(): ElementFinder {
    return element(by.css(this.formLocator + 'button[type="submit"]'));
  }

  getRoles(): ElementArrayFinder {
    return element(by.css(this.formLocator)).all(by.css('input[type="checkbox"]'));
  }

}
