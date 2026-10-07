import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('index.php?route=account/account');
  }

  async expectDashboardVisible() {
    await expect(this.page).toHaveURL(/route=account\/account/);
    await expect(this.page.locator('h2')).toContainText(/My Account|Account/i);
  }

  async expectAuthenticatedMenuVisible() {
    const myAccountLink = this.page.locator('#top-links a[title="My Account"]');
    await expect(myAccountLink).toBeVisible();
    await myAccountLink.click();
    await expect(this.page.locator('#top-links').getByRole('link', { name: /Logout/i })).toBeVisible();
    await myAccountLink.click();
  }
}
