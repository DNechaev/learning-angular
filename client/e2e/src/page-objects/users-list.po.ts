import { browser, by, element, promise, ElementFinder, ElementArrayFinder } from 'protractor';

export class UsersList {

  navigateToUsers(): promise.Promise<any> {
    return browser.get('/users');
  }

  getTable(): ElementFinder {
    return element(by.css('table'));
  }

  // getTableHeader(): promise.Promise<string> {
    // console.log('============================================');
    // console.log('============================================');
    // return this.getTable().all(by.tagName('tr')).get(0).getText();
  // }

  getTableRow(): ElementArrayFinder {
    return this.getTable().all(by.tagName('tr'));
  }

  getFirstRowData(): promise.Promise<string> {
    return this.getTableRow().get(1).getText();
  }

  getLastRowData(): promise.Promise<string> {
    return this.getTableRow().last().getText();
  }

}
