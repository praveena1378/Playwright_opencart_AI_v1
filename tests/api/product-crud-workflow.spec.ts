import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { apiDelete, apiPost, apiPut, expectCreateSuccess, productPayload, updatedProductPayload } from '../../utils/apiTestSupport';

dotenv.config();

test.describe.serial('FakeStore Product CRUD Workflow @master @api', () => {
  test('Create, update, and delete the created product @master @regression @api', async ({ request }) => {
    const createResponse = await apiPost(request, Routes.CREATE_PRODUCT, productPayload);
    expectCreateSuccess(createResponse, 'Product');
    const created = await createResponse.json();
    const productId = Number(created.id);

    expect(Number.isFinite(productId), 'Create response should provide a usable product ID').toBe(true);
    expect(created.title).toBe(productPayload.title);

    const updateResponse = await apiPut(request, Routes.UPDATE_PRODUCT, { id: productId }, updatedProductPayload);
    expect(updateResponse.status(), 'Product update in workflow should return HTTP 200').toBe(200);
    const updated = await updateResponse.json();
    expect(updated.id).toBe(productId);
    expect(updated.title).toBe(updatedProductPayload.title);
    expect(updated.price).toBe(updatedProductPayload.price);

    const deleteResponse = await apiDelete(request, Routes.DELETE_PRODUCT, { id: productId });
    expect(deleteResponse.status(), 'Product deletion in workflow should return HTTP 200').toBe(200);
  });
});
