import { UsersList } from './page-objects/users-list.po';
import {browser, by, element, protractor} from 'protractor';

xdescribe('UsersList Page', () => {

  const usersList: UsersList = new UsersList();

  beforeEach(() => {
    browser.executeScript(
      'localStorage.setItem("SSID","TEST_ADMIN_SSID");'
    );
    usersList.navigateToUsers();
  });

  it('should display the heading Application', () => {
    expect(usersList.getHeading()).toEqual('Users');
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


