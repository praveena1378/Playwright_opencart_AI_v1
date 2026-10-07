import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';
import { apiPost } from '../../utils/apiTestSupport';
import { Routes } from '../../api/endpoints/routes';

dotenv.config();

test.describe('FakeStore Authentication API Tests @master @api', () => {
  test('POST - Successful login returns a non-empty token @master @sanity @api', async ({ request }) => {
    const response = await apiPost(request, Routes.AUTH_LOGIN, {
      username: 'mor_2314',
      password: '83r5^_',
    });

    expect(response.status(), 'Valid login should return HTTP 201').toBe(201);
    const body = await response.json();
    expect(body.token, 'Login response should contain a token').toEqual(expect.any(String));
    expect(body.token.length, 'Authentication token should not be empty').toBeGreaterThan(0);
  });

  test('POST - Invalid login returns the expected authentication error @master @regression @api', async ({ request }) => {
    const response = await apiPost(request, Routes.AUTH_LOGIN, {
      username: 'invalid-user',
      password: 'wrong-password',
    });

    expect(response.status(), 'Invalid login should return HTTP 401').toBe(401);
    const body = await response.json();
    expect(body.message, 'Login error should explain that credentials are incorrect').toBe(
      'username or password is incorrect',
    );
  });
});
