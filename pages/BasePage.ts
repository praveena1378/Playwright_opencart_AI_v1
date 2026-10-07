import 'dotenv/config';
import { type Page } from '@playwright/test';

export const APP_URL = process.env.WEB_APP_URL || 'https://tutorialsninja.com/demo/';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    const nextUrl = url.startsWith('http') ? url : `${APP_URL}${url}`;
    await this.page.goto(nextUrl);
  }
}
