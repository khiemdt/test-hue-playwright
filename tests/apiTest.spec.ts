import { expect, test } from '@playwright/test';
import {
    bookingParrams,
    bookingRequest,
    contact,
    initPage,
    paymentInfo,
    useNamePassCase,
} from './test';

for (const { sdt, pass, code, id } of useNamePassCase) {
    // test vòng lặp số điện thoại và pass, expect khi api trả ra code  (200=> Đăng nhập thành công) (400 =>  Có lỗi xảy ra)
    test(`Test api đăng nhập ${id}`, async ({ request, baseURL }) => {
        const response = await request.post(
            `https://dev-api.tripi.vn/account/loginV2`,
            {
                data: {
                    //truyền api, pass
                    password: pass,
                    user_name: sdt,
                },
            }
        );
        // check xem call api lên có thành công hay không
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
        //gọi api nhận về chi tiết khách sàn Phạm hà với Id khách sạn là 48644
        const response = await request.post(
            `${baseURL}/hotels/v3/hotels/detail`,
            {
                data: {
                    //bookingRequest lấy ở file test.ts. có thể tùy biến số người lớn. số trẻ em, ngày checkin, checkout, số phòng
                    ...bookingRequest,
                },
            }
        );
        expect(response?.ok())?.toBeTruthy();
        expect(response?.status())?.toBe(200);
        const result = await response.json();
        if (result.code == 200) {
            //result.code == 200 nghĩa là tìm được khách sạn đó có ở trên hệ thống.
            let params = {
                ...bookingRequest,
                ...initPage,
            };

            let [result1, result2] = await Promise.all([
                request.post(`${baseURL}/hotels/v3/rooms/availability`, {
                    data: params,
                }),
                request.post(`${baseURL}/hotels/v3/rooms/availability`, {
                    data: params,
                }),
            ]);

            expect(result1?.ok())?.toBeTruthy();
            expect(result1?.status())?.toBe(200);
            expect(result2?.ok())?.toBeTruthy();
            expect(result2?.status())?.toBe(200);

            const res1 = await result1.json();
            const res2 = await result2.json();
            let roomAvailablity: any = null;
            [res1, res2].forEach((el) => {
                if (el.code == 200 && el?.data?.items.length) {
                    roomAvailablity = el?.data?.items[0];
                }
            });
            if (!roomAvailablity) {
                console.log('res1', res1);
                console.log('res2', res2);

                console.log('không tìm được phòng phù hợp');
                return;
            }
            const checkRate = await request.post(
                `${baseURL}/hotels/v3/rooms/rates`,
                {
                    data: {
                        ...bookingRequest,
                        ...initPage,
                        roomKey: roomAvailablity?.roomKey,
                        rateKey: roomAvailablity?.rates[0].rateKey,
                    },
                }
            );
            expect(checkRate?.ok())?.toBeTruthy();
            expect(checkRate?.status())?.toBe(200);
            const rescheckRate = await checkRate.json();
            if (rescheckRate.code !== 200) {
                console.log(rescheckRate);
                console.log('không tìm được phòng phù hợp (rescheckRate)');
                return;
            }
            let roomRates: any = [];
            [...Array(bookingRequest.rooms)].forEach((el: any) => {
                roomRates.push({
                    bedNote: roomAvailablity?.bedGroups[0].bedInfo,
                    ...contact,
                    quantity: 1,
                    shrui: roomAvailablity?.bedGroups[0].shrui,
                });
            });
            // tao booking
            const creatBooking = await request.post(
                `${baseURL}/hotels/v3/bookings/create`,
                {
                    data: {
                        ...bookingRequest,
                        ...bookingParrams,
                        roomRates: roomRates,
                    },
                }
            );
            expect(creatBooking?.ok())?.toBeTruthy();
            expect(creatBooking?.status())?.toBe(200);
            const rescreatBooking: any = await creatBooking?.json();
            if (rescreatBooking.code !== 200) {
                console.log(rescheckRate);
                console.log('Không tạo được booking');
                return;
            }
            const bookingId = rescreatBooking?.data?.id;
            // Thanh toán booking
            // check otp
            // const otp = await request.post(
            //     `https://dev-api.tripi.vn/validateCreditPassword`,
            //     {
            //         data: {
            //             password: '1234',
            //         },
            //     }
            // );
            // expect(otp?.ok())?.toBeTruthy();
            // expect(otp?.status())?.toBe(200);
            // const resotp = await otp.json();
            // if (resotp.code !== 200) {
            //     console.log(rescheckRate);
            //     console.log('Lỗi otp');
            //     return;
            // }
            const payment = await request.post(`${baseURL}/payment/payments`, {
                data: {
                    ...paymentInfo,
                    bookingCode: `H${bookingId}`,
                },
                headers: {
                    ['Content-Type']: 'application/json',
                },
            });
            expect(payment?.ok())?.toBeTruthy();
            expect(payment?.status())?.toBe(200);
            const paymentref = await payment.json();
            if (paymentref.code !== 200) {
                console.log({ ...paymentInfo, bookingCode: `H${bookingId}` });
                console.log(payment);
                console.log('Payment  không thành công');
                return;
            }
            console.log(
                `https://crm-dev.tripi.vn/#!/sale/hotelBookingDetails/${bookingId}`
            );
        } else {
            console.log(result.message);
        }
    });
});
