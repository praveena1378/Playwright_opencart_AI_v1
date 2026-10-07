import { expect, type Page } from '@playwright/test';
import { APP_URL, BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto(APP_URL);
  }

  async openAccountMenu() {
    await this.page.locator('#top-links a[title="My Account"]').click();
  }

  async goToRegister() {
    await this.openAccountMenu();
    await this.page.locator('#top-links').getByRole('link', { name: 'Register' }).click();
    await this.page.waitForURL(/route=account\/register/);
  }

  async goToLogin() {
    await this.openAccountMenu();
    await this.page.locator('#top-links').getByRole('link', { name: 'Login' }).click();
    await this.page.waitForURL(/route=account\/login/);
  }

  async logout() {
    await this.page.goto(`${APP_URL}index.php?route=account/logout`);
    await this.page.waitForURL(/route=account\/logout/);
  }

  async searchForProduct(productName: string) {
    await this.page.locator('input[name="search"]').fill(productName);
    await this.page.locator('button:has(i.fa-search)').click();
    await this.page.waitForURL(/route=product\/search/);
  }

  async expectAuthenticatedAccountLinks() {
    const myAccountLink = this.page.locator('#top-links a[title="My Account"]');
    await expect(myAccountLink).toBeVisible();
    await myAccountLink.click();
    await expect(this.page.locator('#top-links').getByRole('link', { name: /Logout/i })).toBeVisible();
    await myAccountLink.click();
  }
}
