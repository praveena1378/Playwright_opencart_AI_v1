import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { apiDelete, apiPost, apiPut, cartPayload, expectCreateSuccess, updatedCartPayload } from '../../utils/apiTestSupport';

dotenv.config();

test.describe.serial('FakeStore Cart CRUD Workflow @master @api', () => {
  test('Create, update, and delete the created cart @master @regression @api', async ({ request }) => {
    const createResponse = await apiPost(request, Routes.CREATE_CART, cartPayload);
    expectCreateSuccess(createResponse, 'Cart');
    const created = await createResponse.json();
    const cartId = Number(created.id);

    expect(Number.isFinite(cartId), 'Create response should provide a usable cart ID').toBe(true);
    expect(created.userId).toBe(cartPayload.userId);
    expect(created.products).toEqual(cartPayload.products);

    const updateResponse = await apiPut(request, Routes.UPDATE_CART, { id: cartId }, updatedCartPayload);
    expect(updateResponse.status(), 'Cart update in workflow should return HTTP 200').toBe(200);
    const updated = await updateResponse.json();
    expect(updated.id).toBe(cartId);
    expect(updated.userId).toBe(updatedCartPayload.userId);
    expect(updated.products).toEqual(updatedCartPayload.products);
    expect(updated.products[0].quantity).toBe(updatedCartPayload.products[0].quantity);

    const deleteResponse = await apiDelete(request, Routes.DELETE_CART, { id: cartId });
    expect(deleteResponse.status(), 'Cart deletion in workflow should return HTTP 200').toBe(200);
  });
});
