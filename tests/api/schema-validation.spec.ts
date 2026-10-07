import { expect, test } from '@playwright/test';
import Ajv from 'ajv';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import { apiGet, CART_ID, Cart, PRODUCT_ID, Product, USER_ID, User } from '../../utils/apiTestSupport';

dotenv.config();

const validateResponse = (data: unknown, schemaPath: string, description: string): void => {
  const schema = DataProvider.readJson(schemaPath);
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const isValid = validate(data);
  expect(isValid, `${description}: ${ajv.errorsText(validate.errors)}`).toBeTruthy();
};

test.describe('FakeStore API Schema Validation @master @api', () => {
  test('Product response conforms to its JSON schema @master @regression @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_PRODUCT_BY_ID, { id: PRODUCT_ID });
    expect(response.status(), 'Product schema endpoint should return HTTP 200').toBe(200);
    const product = (await response.json()) as Product;

    validateResponse(product, 'api/schemas/product_api_schema.json', 'Product schema validation failed');
  });

  test('User response conforms to its JSON schema @master @regression @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_USER_BY_ID, { id: USER_ID });
    expect(response.status(), 'User schema endpoint should return HTTP 200').toBe(200);
    const user = (await response.json()) as User;

    validateResponse(user, 'api/schemas/user_api_schema.json', 'User schema validation failed');
  });

  test('Cart response conforms to its JSON schema @master @regression @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_CART_BY_ID, { id: CART_ID });
    expect(response.status(), 'Cart schema endpoint should return HTTP 200').toBe(200);
    const cart = (await response.json()) as Cart;

    validateResponse(cart, 'api/schemas/cart_api_schema.json', 'Cart schema validation failed');
  });
});
