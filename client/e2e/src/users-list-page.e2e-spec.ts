import { UsersList } from './page-objects/users-list.po';
import {browser, by, element} from 'protractor';

describe('UsersList Page', () => {

  const usersList: UsersList = new UsersList();

  beforeEach(async () => {
    await usersList.navigateToUsers();
    await usersList.loginAsAdmin();
  });

  it('should display the heading Application', async () => {
    await usersList.sleep(2000);
    // expect(await usersList.getHeading()).toEqual('Users');
  });
/*
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
*/
});


