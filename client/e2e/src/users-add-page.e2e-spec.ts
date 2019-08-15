import { browser } from 'protractor';

import { UsersList } from './page-objects/users-list.po';
import { UsersAdd } from './page-objects/users-add.po';

describe('UsersAdd Page', () => {

  const usersList: UsersList = new UsersList();
  const usersAdd: UsersAdd = new UsersAdd();

  beforeEach(async () => {
    await usersList.navigateToUsers();
    await usersList.loginAsAdmin();
    await usersList.getAddButton().click();

    // Set test data
    await usersAdd.setNameValue('TestUser');
    await usersAdd.setEmailValue('testUser@test.com');
    await usersAdd.setPasswordValue('123456');
  });

  it('should loaded add page', async () => {
    expect(browser.getCurrentUrl()).toContain('/users/new');
  });

  it('should display the heading', async () => {
    expect(await usersAdd.getHeader().getText()).toBe('Create User');
  });

  it('should save button enabled', async () => {
    expect(await usersAdd.getSaveButton().isEnabled()).toBe(true);
  });

  it('should save button disabled by bad name', async () => {
    await usersAdd.setNameValue('');
    expect(await usersAdd.getSaveButton().isEnabled()).toBe(false);
  });

  it('should save button disabled by bad email', async () => {
    await usersAdd.setEmailValue('');
    expect(await usersAdd.getSaveButton().isEnabled()).toBe(false);
  });

  it('should save button disabled by bad password', async () => {
    await usersAdd.setPasswordValue('');
    expect(await usersAdd.getSaveButton().isEnabled()).toBe(false);
  });

  it('should save button disabled by empty roles', async () => {
    usersAdd.getRoles().each(async (roleElement) => {
      if (await roleElement.getAttribute('checked')) {
        await roleElement.click();
      }
    });
    expect(await usersAdd.getSaveButton().isEnabled()).toBe(false);
  });

  it('global search field doesn\'t exist', async () => {
    expect(usersAdd.getSearchInput().isPresent()).toBe(false);
  });

});
