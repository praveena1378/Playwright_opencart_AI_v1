import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { Routes } from '../api/endpoints/routes';

export const API_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
};

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
}

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: { firstname: string; lastname: string };
  address: Record<string, unknown>;
  phone: string;
}

export interface CartProduct {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartProduct[];
}

export const PRODUCT_ID = 1;
export const USER_ID = 1;
export const CART_ID = 1;
export const LIMIT = 5;

export const productPayload = {
  title: 'Playwright API test product',
  price: 29.99,
  description: 'A deterministic product payload for API tests.',
  image: 'https://fakestoreapi.com/img/placeholder.png',
  category: 'electronics',
};

export const updatedProductPayload = {
  ...productPayload,
  title: 'Playwright API test product updated',
  price: 39.99,
};

export const userPayload = {
  email: 'playwright.api.user@example.com',
  username: 'playwright-api-user',
  password: 'TestPassword123!',
  name: { firstname: 'Playwright', lastname: 'Tester' },
  address: {
    city: 'Test City',
    street: 'Test Street',
    number: 10,
    zipcode: '12345',
    geolocation: { lat: '0', long: '0' },
  },
  phone: '555-0100',
};

export const updatedUserPayload = {
  ...userPayload,
  username: 'playwright-api-user-updated',
};

export const cartPayload = {
  userId: USER_ID,
  date: '2020-01-01',
  products: [{ productId: PRODUCT_ID, quantity: 2 }],
};

export const updatedCartPayload = {
  ...cartPayload,
  products: [{ productId: PRODUCT_ID, quantity: 7 }],
};

export const apiUrl = (route: string, replacements: Record<string, string | number> = {}): string => {
  let resolvedRoute = route;

  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = new RegExp(`(:?\\{${key}\\}|:${key})`, 'g');
    resolvedRoute = resolvedRoute.replace(placeholder, encodeURIComponent(String(value)));
  }

  const baseUrl = process.env.API_BASE_URL || Routes.Base_url;
  return `${baseUrl}${resolvedRoute}`;
};

export const apiGet = (
  request: APIRequestContext,
  route: string,
  replacements: Record<string, string | number> = {},
): Promise<APIResponse> => request.get(apiUrl(route, replacements), { headers: API_HEADERS });

export const apiPost = (
  request: APIRequestContext,
  route: string,
  data: unknown,
): Promise<APIResponse> => request.post(apiUrl(route), { data, headers: API_HEADERS });

export const apiPut = (
  request: APIRequestContext,
  route: string,
  replacements: Record<string, string | number>,
  data: unknown,
): Promise<APIResponse> => request.put(apiUrl(route, replacements), { data, headers: API_HEADERS });

export const apiDelete = (
  request: APIRequestContext,
  route: string,
  replacements: Record<string, string | number>,
): Promise<APIResponse> => request.delete(apiUrl(route, replacements), { headers: API_HEADERS });

export const expectCreateSuccess = (response: APIResponse, resource: string): void => {
  expect(response.status(), `${resource} creation should return HTTP 201`).toBe(201);
};

export const expectSortedIds = (ids: number[], direction: 'asc' | 'desc', resource: string): void => {
  const sortedIds = [...ids].sort((a, b) => (direction === 'asc' ? a - b : b - a));
  expect(ids, `${resource} IDs should be sorted ${direction}`).toEqual(sortedIds);
};
