import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SuccessPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectRegistrationSuccess() {
    await expect(this.page).toHaveURL(/route=account\/success/);
    await expect(this.page.locator('body')).toContainText(/Your Account Has Been Created!/i);
  }

  async expectOrderSuccess() {
    await expect(this.page.locator('body')).toContainText(/Your order has been placed!/i);
  }
}
