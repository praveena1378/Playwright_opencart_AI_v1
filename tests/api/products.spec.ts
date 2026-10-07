import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  expectCreateSuccess,
  expectSortedIds,
  LIMIT,
  PRODUCT_ID,
  Product,
  productPayload,
  updatedProductPayload,
} from '../../utils/apiTestSupport';

dotenv.config();

test.describe('FakeStore Products API Tests @master @api', () => {
  test('GET - All products returns a non-empty array with required fields @master @sanity @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_ALL_PRODUCTS);
    expect(response.status(), 'Products request should return HTTP 200').toBe(200);
    const products = (await response.json()) as Product[];

    expect(Array.isArray(products), 'Products response should be an array').toBe(true);
    expect(products.length, 'At least one product should be returned').toBeGreaterThan(0);
    expect(products[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
      price: expect.any(Number),
      category: expect.any(String),
      image: expect.any(String),
    }));
  });

  test('GET - Product by ID returns the requested product @master @sanity @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_PRODUCT_BY_ID, { id: PRODUCT_ID });
    expect(response.status(), 'Product lookup should return HTTP 200').toBe(200);
    const product = (await response.json()) as Product;

    expect(product.id, 'Returned product ID should match the requested ID').toBe(PRODUCT_ID);
    expect(product.title).toEqual(expect.any(String));
    expect(product.price).toEqual(expect.any(Number));
    expect(product.category).toEqual(expect.any(String));
    expect(product.image).toEqual(expect.any(String));
  });

  test('GET - Product limit returns the requested count @master @regression @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_PRODUCTS_WITH_LIMIT, { limit: LIMIT });
    expect(response.status(), 'Limited product request should return HTTP 200').toBe(200);
    const products = await response.json();

    expect(Array.isArray(products), 'Limited products response should be an array').toBe(true);
    expect(products, `Product limit should return ${LIMIT} records`).toHaveLength(LIMIT);
  });

  for (const direction of ['asc', 'desc'] as const) {
    test(`GET - Products sort ${direction} by ID @master @regression @api`, async ({ request }) => {
      const response = await apiGet(request, Routes.GET_PRODUCTS_SORTED, { ORDER: direction });
      expect(response.status(), `Sorted product request (${direction}) should return HTTP 200`).toBe(200);
      const products = (await response.json()) as Product[];
      expectSortedIds(products.map((product) => product.id), direction, 'Product');
    });
  }

  test('GET - All product categories returns a non-empty array @master @regression @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_ALL_CATEGORIES);
    expect(response.status(), 'Product categories request should return HTTP 200').toBe(200);
    const categories = await response.json();

    expect(Array.isArray(categories), 'Categories response should be an array').toBe(true);
    expect(categories.length, 'At least one category should be returned').toBeGreaterThan(0);
    expect(categories.every((category: unknown) => typeof category === 'string')).toBe(true);
  });

  test('GET - Products by category only returns matching products @master @regression @api', async ({ request }) => {
    const category = 'electronics';
    const response = await apiGet(request, Routes.GET_PRODUCTS_IN_CATEGORY, { category });
    expect(response.status(), 'Category products request should return HTTP 200').toBe(200);
    const products = (await response.json()) as Product[];

    expect(Array.isArray(products), 'Category products response should be an array').toBe(true);
    for (const product of products) {
      expect(product.category, `Product ${product.id} should belong to ${category}`).toBe(category);
    }
  });

  test('POST - Create product returns ID and submitted values @master @regression @api', async ({ request }) => {
    const response = await apiPost(request, Routes.CREATE_PRODUCT, productPayload);
    expectCreateSuccess(response, 'Product');
    const created = await response.json();

    expect(created.id, 'Created product should include an ID').toEqual(expect.any(Number));
    expect(created).toEqual(expect.objectContaining(productPayload));
  });

  test('PUT - Update product returns requested ID and changed values @master @regression @api', async ({ request }) => {
    const response = await apiPut(request, Routes.UPDATE_PRODUCT, { id: PRODUCT_ID }, updatedProductPayload);
    expect(response.status(), 'Product update should return HTTP 200').toBe(200);
    const updated = await response.json();

    expect(updated.id, 'Updated product ID should match the requested ID').toBe(PRODUCT_ID);
    expect(updated.title).toBe(updatedProductPayload.title);
    expect(updated.price).toBe(updatedProductPayload.price);
  });

  test('DELETE - Delete product succeeds @master @regression @api', async ({ request }) => {
    const response = await apiDelete(request, Routes.DELETE_PRODUCT, { id: PRODUCT_ID });
    expect(response.status(), 'Product deletion should return HTTP 200').toBe(200);
    const deleted: unknown = await response.json();

    if (deleted && typeof deleted === 'object' && 'id' in deleted) {
      expect(deleted.id, 'Delete response should identify the requested product').toBe(PRODUCT_ID);
    }
  });
});
