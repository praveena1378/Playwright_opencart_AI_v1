import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';
import { RandomDataUtil } from '../../utils/dataGenerator';

test.describe('Customer shopping journey @master', () => {
  test('registers, logs in again, searches for a product, adds it to cart, and validates totals @e2e', async ({
    page,
    homePage,
    registerPage,
    loginPage,
    productPage,
    cartPage,
  }) => {
    const product = Helper.getProductDetails();
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const uniqueEmail = `${RandomDataUtil.getUsername()}-${Date.now()}@example.com`;
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = 'Test@12345';

    await homePage.open();
    await homePage.goToRegister();

    await registerPage.registerCustomer({
      firstName,
      lastName,
      email: uniqueEmail,
      telephone,
      password,
    });

    await registerPage.assertAccountCreated();
    await expect(page).toHaveURL(/route=account\/success/);

    await homePage.logout();
    await homePage.goToLogin();
    await loginPage.login(uniqueEmail, password);

    await expect(page).toHaveURL(/route=account\/account/);
    await homePage.expectAuthenticatedAccountLinks();

    await homePage.searchForProduct(product.productName);
    await productPage.openProductFromSearch(product.productName);
    await productPage.addToCart(product.productQuantity);

    await cartPage.open();
    await cartPage.assertProduct(
      product.productName,
      product.productQuantity,
      product.totalPrice,
      product.totalPrice,
    );

    await expect(page.locator('body')).not.toContainText('Warning');
    await expect(page.locator('body')).not.toContainText('Error');
  });
});

