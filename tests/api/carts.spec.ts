import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  CART_ID,
  Cart,
  cartPayload,
  expectCreateSuccess,
  expectSortedIds,
  LIMIT,
  updatedCartPayload,
  USER_ID,
} from '../../utils/apiTestSupport';

dotenv.config();

test.describe('FakeStore Carts API Tests @master @api', () => {
  test('GET - All carts returns a non-empty array @master @sanity @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_ALL_CARTS);
    expect(response.status(), 'Carts request should return HTTP 200').toBe(200);
    const carts = await response.json();

    expect(Array.isArray(carts), 'Carts response should be an array').toBe(true);
    expect(carts.length, 'At least one cart should be returned').toBeGreaterThan(0);
  });

  test('GET - Cart by ID returns the requested cart @master @sanity @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_CART_BY_ID, { id: CART_ID });
    expect(response.status(), 'Cart lookup should return HTTP 200').toBe(200);
    const cart = (await response.json()) as Cart;

    expect(cart.id, 'Returned cart ID should match the requested ID').toBe(CART_ID);
    expect(cart.userId).toEqual(expect.any(Number));
    expect(Array.isArray(cart.products), 'Cart products should be an array').toBe(true);
  });

  test('GET - Carts by date range returns carts in range @master @regression @api', async ({ request }) => {
    const startDate = '2019-12-01';
    const endDate = '2020-12-31';
    const response = await apiGet(request, Routes.GET_CARTS_BY_DATE_RANGE, {
      START_DATE: startDate,
      END_DATE: endDate,
    });
    expect(response.status(), 'Date-filtered carts request should return HTTP 200').toBe(200);
    const carts = (await response.json()) as Cart[];

    expect(Array.isArray(carts), 'Date-filtered carts response should be an array').toBe(true);
    for (const cart of carts) {
      expect(cart.date >= startDate, `Cart ${cart.id} should not be earlier than ${startDate}`).toBe(true);
      expect(cart.date <= endDate, `Cart ${cart.id} should not be later than ${endDate}`).toBe(true);
    }
  });

  test('GET - User carts belong to the requested user @master @regression @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_USER_CART, { userId: USER_ID });
    expect(response.status(), 'User carts request should return HTTP 200').toBe(200);
    const carts = (await response.json()) as Cart[];

    expect(Array.isArray(carts), 'User carts response should be an array').toBe(true);
    for (const cart of carts) {
      expect(cart.userId, `Cart ${cart.id} should belong to user ${USER_ID}`).toBe(USER_ID);
    }
  });

  test('GET - Cart limit returns the requested count @master @regression @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_CARTS_IN_LIMIT, { limit: LIMIT });
    expect(response.status(), 'Limited cart request should return HTTP 200').toBe(200);
    const carts = await response.json();

    expect(Array.isArray(carts), 'Limited carts response should be an array').toBe(true);
    expect(carts, `Cart limit should return ${LIMIT} records`).toHaveLength(LIMIT);
  });

  for (const direction of ['asc', 'desc'] as const) {
    test(`GET - Carts sort ${direction} by ID @master @regression @api`, async ({ request }) => {
      const response = await apiGet(request, Routes.GET_CARTS_SORTED, { ORDER: direction });
      expect(response.status(), `Sorted cart request (${direction}) should return HTTP 200`).toBe(200);
      const carts = (await response.json()) as Cart[];
      expectSortedIds(carts.map((cart) => cart.id), direction, 'Cart');
    });
  }

  test('POST - Create cart returns ID and submitted values @master @regression @api', async ({ request }) => {
    const response = await apiPost(request, Routes.CREATE_CART, cartPayload);
    expectCreateSuccess(response, 'Cart');
    const created = await response.json();

    expect(created.id, 'Created cart should include an ID').toEqual(expect.any(Number));
    expect(created.userId).toBe(cartPayload.userId);
    expect(created.products).toEqual(cartPayload.products);
  });

  test('PUT - Update cart reflects the requested quantity @master @regression @api', async ({ request }) => {
    const response = await apiPut(request, Routes.UPDATE_CART, { id: CART_ID }, updatedCartPayload);
    expect(response.status(), 'Cart update should return HTTP 200').toBe(200);
    const updated = await response.json();

    expect(updated.id).toBe(CART_ID);
    expect(updated.userId).toBe(updatedCartPayload.userId);
    expect(updated.products).toEqual(updatedCartPayload.products);
  });

  test('DELETE - Delete cart succeeds @master @regression @api', async ({ request }) => {
    const response = await apiDelete(request, Routes.DELETE_CART, { id: CART_ID });
    expect(response.status(), 'Cart deletion should return HTTP 200').toBe(200);
    const deleted: unknown = await response.json();

    if (deleted && typeof deleted === 'object' && 'id' in deleted) {
      expect(deleted.id, 'Delete response should identify the requested cart').toBe(CART_ID);
    }
  });
});
