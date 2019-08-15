import { browser } from 'protractor';

import { UsersList } from './page-objects/users-list.po';
import { UsersEdit } from './page-objects/users-edit.po';

describe('UsersEdit Page', () => {

  const usersList: UsersList = new UsersList();
  const usersEdit: UsersEdit = new UsersEdit();

  beforeEach(async () => {
    await usersList.navigateToUsers();
    await usersList.loginAsAdmin();
    await usersList.getLastEditButton().click();

    // Set test data
    await usersEdit.setNameValue('TestUser');
    await usersEdit.setEmailValue('testUser@test.com');
    await usersEdit.setPasswordValue('123456');
  });

  it('should loaded add page', async () => {
    expect(browser.getCurrentUrl()).toMatch(/users\/[0-9]+$/);
  });

  it('should display the heading', async () => {
    expect(await usersEdit.getHeader().getText()).toMatch(/Edit User \[[0-9]+\]$/);
  });

  it('should save button enabled', async () => {
    expect(await usersEdit.getSaveButton().isEnabled()).toBe(true);
  });

  it('should save button disabled by bad name', async () => {
    await usersEdit.setNameValue('');
    expect(await usersEdit.getSaveButton().isEnabled()).toBe(false);
  });

  it('should save button disabled by bad email', async () => {
    await usersEdit.setEmailValue('');
    expect(await usersEdit.getSaveButton().isEnabled()).toBe(false);
  });

  it('should save button disabled by bad password', async () => {
    await usersEdit.setPasswordValue('');
    expect(await usersEdit.getSaveButton().isEnabled()).toBe(true);
  });

  it('should save button disabled by empty roles', async () => {
    usersEdit.getRoles().each(async (roleElement) => {
      if (await roleElement.getAttribute('checked')) {
        await roleElement.click();
      }
    });
    expect(await usersEdit.getSaveButton().isEnabled()).toBe(false);
  });

  it('global search field doesn\'t exist', async () => {
    expect(usersEdit.getSearchInput().isPresent()).toBe(false);
  });

});
