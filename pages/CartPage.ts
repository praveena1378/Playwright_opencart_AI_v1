import { expect, type Page } from '@playwright/test';
import { APP_URL, BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.page.goto(`${APP_URL}index.php?route=checkout/cart`);
    await this.page.waitForURL(/route=checkout\/cart/);
  }

  async assertProduct(productName: string, quantity: string, price: string, total: string) {
    const row = this.page.locator('table tbody tr').filter({ hasText: productName }).first();

    await expect(row).toContainText(productName);
    await expect(row).toContainText(quantity);
    await expect(row).toContainText(price);
    await expect(row).toContainText(total);

    await expect(this.page.locator('body')).toContainText(productName);
    await expect(this.page.locator('body')).toContainText('$602.00');
  }
}
