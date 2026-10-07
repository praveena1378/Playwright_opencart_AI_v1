import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LogoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async confirmLogout() {
    await this.page.getByRole('link', { name: /Logout/i }).click();
    await this.page.waitForURL(/route=account\/logout/);
  }

  async expectLogoutSuccess() {
    await expect(this.page).toHaveURL(/route=account\/logout/);
    await expect(this.page.locator('body')).toContainText(/You have been logged off|logged off/i);
  }
}
