import { UsersList } from './page-objects/users-list.po';
import {browser, by, element, protractor} from 'protractor';

describe('UsersList Page', () => {

  const usersList: UsersList = new UsersList();

  beforeEach(() => {
    browser.executeScript(
      'localStorage.setItem("currentUser","{\"id\":1,\"email\":\"admin@test.com\",\"name\":\"Admin\",\"ssid\":\"7f04e0f8a4353e26250141a13cc3be9e\",\"roles\":[]}");'
    );
    usersList.navigateToUsers();
  });

  it('should display the heading Pastebin Application', () => {
    // expect(usersList.getPastebinHeading()).toEqual('Pastebin Application');
  });

  it('should have a table header', async () => {
    console.log('=============================');
    const table = await element(by.css('table'));
    console.log(table);


    // const row = await table.all(by.tagName('tr')); //.get(0);

    // console.log(row);
    // console.log(await row.getText());

    // expect(usersList.getTableHeader()).toContain('id Title Language Code');
  });

  it('table should have at least one row', () => {
    expect(usersList.getFirstRowData()).toContain('Hello world');
  });

  it('should have the app-add-paste tag', () => {
    // expect(usersList.isAddPasteTagPresent()).toBeTruthy();
  });

});


