import { expect, test } from '@playwright/test';
import { useNamePassCase } from './test';

for (const { sdt, pass, code, id } of useNamePassCase) {
    test(`Test api đăng nhập ${id}`, async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/account/loginV2`, {
            data: {
                password: pass,
                user_name: sdt,
            },
        });
        expect(response?.ok())?.toBeTruthy();
        expect(response?.status())?.toBe(200);
        const result = await response.json();
        console.log(result?.code);
        console.log(result?.message);
        expect(result?.code)?.toBe(code);
    });
}
