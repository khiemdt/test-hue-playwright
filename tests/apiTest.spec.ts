import { expect, test } from '@playwright/test';
import { useNamePassCase } from './test';

for (const { sdt, pass, code, id } of useNamePassCase) {
    test(`Test api đăng nhập ${id}`, async ({ request, baseURL }) => {
        const response = await request.post(
            `https://dev-api.tripi.vn/account/loginV2`,
            {
                data: {
                    password: pass,
                    user_name: sdt,
                },
            }
        );
        expect(response?.ok())?.toBeTruthy();
        expect(response?.status())?.toBe(200);
        const result = await response.json();
        console.log(result?.code);
        console.log(result?.message);
        expect(result?.code)?.toBe(code);
    });
}
test.describe('Luồng booking sử dụng api', () => {
    test('Search detail phòng', async ({ request, baseURL }) => {
        const response = await request.post(
            `${baseURL}/hotels/v3/hotels/detail`,
            {
                data: {
                    adults: 2,
                    checkIn: '27-02-2023',
                    checkOut: '28-02-2023',
                    children: 0,
                    hotelId: 48644,
                    rooms: 1,
                },
            }
        );
        expect(response?.ok())?.toBeTruthy();
        expect(response?.status())?.toBe(200);
        const result = await response.json();
        console.log(result);
    });
});
