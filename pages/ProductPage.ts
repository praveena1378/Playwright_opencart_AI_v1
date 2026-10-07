import { type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openProductFromSearch(productName: string) {
    await this.page.getByRole('link', { name: productName }).first().click();
    await this.page.waitForURL(/route=product\/product/);
  }

  async addToCart(quantity: string) {
    await this.page.locator('#input-quantity').fill(quantity);
    await this.page.locator('#button-cart').click();
    await this.page.getByText('Success: You have added').waitFor({ state: 'visible' });
  }
}
