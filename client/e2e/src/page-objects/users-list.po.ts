import { browser, by, element, promise, ElementFinder, ElementArrayFinder } from 'protractor';
import { Base } from './base.po';

export class UsersList extends Base {

  navigateToUsers(): promise.Promise<any> {
    return browser.get('/users');
  }

  getHeading(): ElementFinder {
    return element(by.css('h1'));
  }

  getTable(): ElementFinder {
    return element(by.css('#content_body table'));
  }

  getTableHeader(): promise.Promise<string> {
    return this.getTable().all(by.tagName('tr')).get(0).getText();
  }

  getTableRows(): ElementArrayFinder {
    return this.getTable().all(by.tagName('tr'));
  }

  getFirstRow(): ElementFinder {
    return this.getTableRows().get(1);
  }

  getLastRow(): ElementFinder {
    return this.getTableRows().last();
  }

  getFirstRowData(): promise.Promise<string> {
    return this.getFirstRow().getText();
  }

  getLastRowData(): promise.Promise<string> {
    return this.getLastRow().getText();
  }

  getColumnByIndex(row: ElementFinder, index: number ): ElementFinder {
    return row.all(by.tagName('td')).get(index);
  }

  getAddButton(): ElementFinder {
    return element(by.css('#content_header button'));
  }

  getFirstEditButton(): ElementFinder {
    return this.getFirstRow().all(by.css('button[title="Edit"]')).get(0);
  }

  getFirstDeleteButton(): ElementFinder {
    return this.getFirstRow().all(by.css('button[title="Delete"]')).get(0);
  }

  getLastEditButton(): ElementFinder {
    return this.getLastRow().all(by.css('button[title="Edit"]')).get(0);
  }

  getLastDeleteButton(): ElementFinder {
    return this.getLastRow().all(by.css('button[title="Delete"]')).get(0);
  }

}
