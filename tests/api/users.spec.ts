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
  updatedUserPayload,
  USER_ID,
  User,
  userPayload,
} from '../../utils/apiTestSupport';

dotenv.config();

test.describe('FakeStore Users API Tests @master @api', () => {
  test('GET - All users returns a non-empty array @master @sanity @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_ALL_USERS);
    expect(response.status(), 'Users request should return HTTP 200').toBe(200);
    const users = await response.json();

    expect(Array.isArray(users), 'Users response should be an array').toBe(true);
    expect(users.length, 'At least one user should be returned').toBeGreaterThan(0);
  });

  test('GET - User by ID returns the requested user @master @sanity @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_USER_BY_ID, { id: USER_ID });
    expect(response.status(), 'User lookup should return HTTP 200').toBe(200);
    const user = (await response.json()) as User;

    expect(user.id, 'Returned user ID should match the requested ID').toBe(USER_ID);
    expect(user.email).toEqual(expect.any(String));
    expect(user.username).toEqual(expect.any(String));
  });

  test('GET - User limit returns the requested count @master @regression @api', async ({ request }) => {
    const response = await apiGet(request, Routes.GET_USERS_IN_LIMIT, { limit: LIMIT });
    expect(response.status(), 'Limited user request should return HTTP 200').toBe(200);
    const users = await response.json();

    expect(Array.isArray(users), 'Limited users response should be an array').toBe(true);
    expect(users, `User limit should return ${LIMIT} records`).toHaveLength(LIMIT);
  });

  for (const direction of ['asc', 'desc'] as const) {
    test(`GET - Users sort ${direction} by ID @master @regression @api`, async ({ request }) => {
      const response = await apiGet(request, Routes.GET_USERS_SORTED, { ORDER: direction });
      expect(response.status(), `Sorted user request (${direction}) should return HTTP 200`).toBe(200);
      const users = (await response.json()) as User[];
      expectSortedIds(users.map((user) => user.id), direction, 'User');
    });
  }

  test('POST - Create user returns ID and submitted values @master @regression @api', async ({ request }) => {
    const response = await apiPost(request, Routes.CREATE_USER, userPayload);
    expectCreateSuccess(response, 'User');
    const created = await response.json();

    expect(created.id, 'Created user should include an ID').toEqual(expect.any(Number));
    expect(created).toEqual(expect.objectContaining(userPayload));
  });

  test('PUT - Update user returns requested ID and changed values @master @regression @api', async ({ request }) => {
    const response = await apiPut(request, Routes.UPDATE_USER, { id: USER_ID }, updatedUserPayload);
    expect(response.status(), 'User update should return HTTP 200').toBe(200);
    const updated = await response.json();

    expect(updated.id, 'Updated user ID should match the requested ID').toBe(USER_ID);
    expect(updated.username).toBe(updatedUserPayload.username);
    expect(updated.email).toBe(updatedUserPayload.email);
  });

  test('DELETE - Delete user succeeds @master @regression @api', async ({ request }) => {
    const response = await apiDelete(request, Routes.DELETE_USER, { id: USER_ID });
    expect(response.status(), 'User deletion should return HTTP 200').toBe(200);
    const deleted: unknown = await response.json();

    if (deleted && typeof deleted === 'object' && 'id' in deleted) {
      expect(deleted.id, 'Delete response should identify the requested user').toBe(USER_ID);
    }
  });
});
