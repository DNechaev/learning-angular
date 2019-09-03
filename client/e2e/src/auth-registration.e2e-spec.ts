import { AuthRegistration } from './page-objects/auth-registration.po';
import { browser, logging } from 'protractor';

describe('Registration Page', () => {
  let page: AuthRegistration;

  beforeEach(async () => {
    page = new AuthRegistration();
    await page.navigateToRegistration();

    // By default input correct data
    await page.setFieldValue('#inputEmail', 'test@test.com');
    await page.elementSendTab('#inputEmail');

    await page.setFieldValue('#inputPassword', '123456');
    await page.elementSendTab('#inputPassword');

    await page.setFieldValue('#inputName', 'User');
    await page.elementSendTab('#inputName');
  });

  it('should display Registration', async () => {
    expect(page.getTitleText()).toEqual('Registration');
  });

  it('registration button should be enabled', async () => {
    expect(await page.elementIsEnabled('button[type="submit"]')).toBe(true);
  });

  it('should don\'t display error symbols on Email field', async () => {
    expect(await page.elementExist('#formGroupEmail .error-symbol')).toBe(false);
  });

  it('should don\'t display error symbols on Password field', async () => {
    expect(await page.elementExist('#formGroupPassword .error-symbol')).toBe(false);
  });

  it('should don\'t display error symbols on Name field', async () => {
    expect(await page.elementExist('#formGroupName .error-symbol')).toBe(false);
  });

  it('should display error symbols on Email field', async () => {
    await page.clearFieldValue('#inputEmail');
    await page.setFieldValue('#inputEmail', 'test@test.');
    await page.elementSendTab('#inputEmail');
    expect(await page.elementExist('#formGroupEmail .error-symbol')).toBe(true);
  });

  it('should display error symbols on Password field', async () => {
    await page.clearFieldValue('#inputPassword');
    await page.setFieldValue('#inputPassword', '123');
    await page.elementSendTab('#inputPassword');
    expect(await page.elementExist('#formGroupPassword .error-symbol')).toBe(true);
  });

  it('should display error symbols on Name field', async () => {
    await page.clearFieldValue('#inputName');
    await page.setFieldValue('#inputName', 'U');
    await page.elementSendTab('#inputName');
    expect(await page.elementExist('#formGroupName .error-symbol')).toBe(true);
  });

  it('registration button should be disabled by bad email', async () => {
    await page.clearFieldValue('#inputEmail');
    await page.setFieldValue('#inputEmail', 'test@test.');
    await page.elementSendTab('#inputEmail');
    expect(await page.elementIsEnabled('button[type="submit"]')).toBe(false);
  });

  it('registration button should be disabled by bad password', async () => {
    await page.clearFieldValue('#inputPassword');
    await page.setFieldValue('#inputPassword', '123');
    await page.elementSendTab('#inputPassword');
    expect(await page.elementIsEnabled('button[type="submit"]')).toBe(false);
  });

  it('registration button should be disabled by bad name', async () => {
    await page.clearFieldValue('#inputName');
    await page.setFieldValue('#inputName', 'U');
    await page.elementSendTab('#inputName');
    expect(await page.elementIsEnabled('button[type="submit"]')).toBe(false);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });

});
