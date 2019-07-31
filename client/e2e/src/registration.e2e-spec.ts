import { RegistrationPage } from './registration.po';
import { browser, logging } from 'protractor';

describe('workspace-project Registration', () => {
  let page: RegistrationPage;

  beforeEach(() => {
    page = new RegistrationPage();
    page.navigateTo('auth/registration');
  });

  it('should display Registration', async () => {
    expect(page.getTitleText()).toEqual('Registration');
  });

  it('should display error symbols', async () => {
    page.setFieldValue('#inputEmail', 'test@test.');
    page.setFieldValue('#inputPassword', '123');
    page.setFieldValue('#inputName', 'U');

    expect(await page.getFieldValue('#inputEmail')).toBe('test@test.');
    expect(await page.getFieldValue('#inputPassword')).toBe('123');
    expect(await page.getFieldValue('#inputName')).toBe('U');

    await page.elementClick('#inputEmail');
    // await page.elementClick('#inputPassword');
    // await page.elementClick('button[type="submit"]');

    // console.log('+++++++++++++++++++++++++');
    // console.log(await page.elementExist('#formGroupEmail .error-symbol'));
    // console.log(await page.elementExist('#formGroupPassword .error-symbol'));
    // console.log(await page.elementExist('#formGroupName .error-symbol'));

    expect(await page.elementExist('#formGroupEmail .error-symbol')).toBe(true);
    expect(await page.elementExist('#formGroupPassword .error-symbol')).toBe(true);
    expect(await page.elementExist('#formGroupName .error-symbol')).toBe(true);

    // await page.sleep(5000);
  });


  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
