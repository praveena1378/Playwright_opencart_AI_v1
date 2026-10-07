import { type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async registerCustomer(data: {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    password: string;
  }) {
    await this.page.locator('#input-firstname').fill(data.firstName);
    await this.page.locator('#input-lastname').fill(data.lastName);
    await this.page.locator('#input-email').fill(data.email);
    await this.page.locator('#input-telephone').fill(data.telephone);
    await this.page.locator('#input-password').fill(data.password);
    await this.page.locator('#input-confirm').fill(data.password);
    await this.page.locator('input[name="agree"]').check();
    await this.page.locator('input[type="submit"][value="Continue"]').click();
  }

  async assertAccountCreated() {
    await this.page.getByText('Your Account Has Been Created!').waitFor({ state: 'visible' });
  }
}
