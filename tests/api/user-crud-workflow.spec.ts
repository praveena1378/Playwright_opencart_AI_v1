import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { apiDelete, apiPost, apiPut, expectCreateSuccess, updatedUserPayload, userPayload } from '../../utils/apiTestSupport';

dotenv.config();

test.describe.serial('FakeStore User CRUD Workflow @master @api', () => {
  test('Create, update, and delete the created user @master @regression @api', async ({ request }) => {
    const createResponse = await apiPost(request, Routes.CREATE_USER, userPayload);
    expectCreateSuccess(createResponse, 'User');
    const created = await createResponse.json();
    const userId = Number(created.id);

    expect(Number.isFinite(userId), 'Create response should provide a usable user ID').toBe(true);
    expect(created.username).toBe(userPayload.username);

    const updateResponse = await apiPut(request, Routes.UPDATE_USER, { id: userId }, updatedUserPayload);
    expect(updateResponse.status(), 'User update in workflow should return HTTP 200').toBe(200);
    const updated = await updateResponse.json();
    expect(updated.id).toBe(userId);
    expect(updated.username).toBe(updatedUserPayload.username);
    expect(updated.email).toBe(updatedUserPayload.email);

    const deleteResponse = await apiDelete(request, Routes.DELETE_USER, { id: userId });
    expect(deleteResponse.status(), 'User deletion in workflow should return HTTP 200').toBe(200);
  });
});
