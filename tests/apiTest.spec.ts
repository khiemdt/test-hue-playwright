import { test, expect, type Page } from '@playwright/test';
import { searchQueries } from './test';

test('create a new user', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/ams/account/simple-info`);
    expect(response?.ok())?.toBeTruthy();
    expect(response?.status())?.toBe(200);
    console.log(await response.json());
});
