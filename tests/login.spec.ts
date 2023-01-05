import { test, expect, type Page } from '@playwright/test';
import { useNamePassCase } from './test';

for (const { sdt, pass, result } of useNamePassCase) {
    test(`Search function test ${sdt} `, async ({ page }: { page: Page }) => {
        // Navigate to the website
        await page.goto('https://alpha.tripi.vn/');
        const loginButton: any = await page.getByRole('button', { name: 'Đăng nhập' });
        await loginButton?.click();
        await expect(page.getByText('Đăng nhập Tripi Partner qua')).toBeVisible();
        await page.getByPlaceholder('Ví dụ: 0901234567').click();
        await page.getByPlaceholder('Ví dụ: 0901234567').fill(sdt);
        await page.getByPlaceholder('******').click();
        await page.getByPlaceholder('******').fill(pass);
        await page.getByRole('button', { name: 'Đăng nhập' }).click();
        await expect(page.getByText(result)).toBeVisible();
    });
}
