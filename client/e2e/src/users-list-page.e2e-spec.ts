import { browser } from 'protractor';

import { UsersList } from './page-objects/users-list.po';
import { UsersAdd } from './page-objects/users-add.po';
import { UsersEdit } from './page-objects/users-edit.po';

describe('UsersList Page', () => {

  const usersList: UsersList = new UsersList();

  beforeEach(async () => {
    await usersList.navigateToUsers();
    await usersList.loginAsAdmin();
  });

  it('should display the heading Application', async () => {
    expect(await usersList.getHeading().getText()).toEqual('Users');
  });

  it('should have a table header',  () => {
    expect(usersList.getTableHeader()).toContain('Name Email Actions');
  });

  it('table should have more than 1 row', () => {
    expect(usersList.getTableRows().count()).toBe(6);
  });

  it('should be an add button', async () => {
    expect(await usersList.getAddButton().isPresent()).toBe(true);
  });

  it('link for add button', async () => {
    await usersList.getAddButton().click();
    expect(browser.getCurrentUrl()).toContain('/users/new');
  });

  it('link for edit button', async () => {
    await usersList.getLastEditButton().click();
    expect(browser.getCurrentUrl()).toMatch(/users\/[0-9]+$/);
  });

  it('link for delete button', async () => {
    await usersList.getLastDeleteButton().click();
    expect(browser.switchTo().alert().getText()).toContain('Delete user');
    await browser.switchTo().alert().dismiss();
  });

  it('global search field exists', async () => {
    expect(usersList.getSearchInput().isPresent()).toBe(true);
  });

  it('filter rows dy global search field', async () => {
    const count = await usersList.getTableRows().count();
    expect(count).toBe(6);

    await usersList.setSearchValue('TestQueryString');
    expect(usersList.getTableRows().count()).toBe(1);

    await usersList.setSearchValue('');
    expect(usersList.getTableRows().count()).toBe(count);
  });

});

describe('User actions', () => {

  const usersList: UsersList = new UsersList();
  const usersAdd: UsersAdd = new UsersAdd();
  const usersEdit: UsersEdit = new UsersEdit();
  let rowCount: number;

  async function addUser() {
    await usersList.navigateToUsers();
    await usersList.getAddButton().click();

    await usersAdd.setNameValue('TestUser');
    await usersAdd.setEmailValue('testUser@test.com');
    await usersAdd.setPasswordValue('123456');
    await usersAdd.getSaveButton().click();
  }

  async function deleteUser() {
    await usersList.navigateToUsers();
    const name = await usersList.getColumnByIndex(usersList.getLastRow(), 0).getText();
    expect(name).toBe('TestUser');
    if ( name === 'TestUser' ) {
      await usersList.getLastDeleteButton().click();
      const alert = browser.switchTo().alert();
      expect(await alert.getText()).toContain('Delete user');
      await alert.accept();
      expect(browser.getCurrentUrl()).toMatch(/users$/);
    }
  }

  beforeEach(async () => {
    await usersList.navigateToUsers();
    await usersList.loginAsAdmin();
    rowCount = await usersList.getTableRows().count();
    await addUser();
    expect(usersList.getTableRows().count()).toBe(rowCount + 1);
  });

  afterEach(async () => {
    await deleteUser();
    expect(usersList.getTableRows().count()).toBe(rowCount);
  });

  it('add/edit/delete user', async () => {
    let name: string;

    // Edit user
    name = await usersList.getColumnByIndex(usersList.getLastRow(), 0).getText();
    expect(name).toBe('TestUser');
    if ( name === 'TestUser' ) {
      await usersList.getLastEditButton().click();
      expect(browser.getCurrentUrl()).toMatch(/users\/[0-9]+$/);

      await usersEdit.setNameValue('TestUserChanged');
      await usersEdit.setEmailValue('testUserChanged@test.com');
      await usersEdit.setPasswordValue('654321');
      // reverse role
      usersEdit.getRoles().each(async (roleElement) => {
        await roleElement.click();
      });
      await usersEdit.getSaveButton().click();

      expect(browser.getCurrentUrl()).toMatch(/users$/);
      expect(usersList.getTableRows().count()).toBe(7);
    }

    // Edit user
    name = await usersList.getColumnByIndex(usersList.getLastRow(), 0).getText();
    expect(name).toBe('TestUserChanged');
    if ( name === 'TestUserChanged' ) {
      await usersList.getLastEditButton().click();
      expect(browser.getCurrentUrl()).toMatch(/users\/[0-9]+$/);

      await usersEdit.setNameValue('TestUser');
      await usersEdit.setEmailValue('testUser@test.com');
      await usersEdit.setPasswordValue('123456');
      // reverse role
      usersEdit.getRoles().each(async (roleElement) => {
        await roleElement.click();
      });
      await usersEdit.getSaveButton().click();

      expect(browser.getCurrentUrl()).toMatch(/users$/);
      expect(usersList.getTableRows().count()).toBe(7);
    }

  });

});
