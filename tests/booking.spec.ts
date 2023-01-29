import { test, expect, type Page } from "@playwright/test";
import { setCookieVals } from "./test";

test.beforeEach(async ({ page, context }) => {
  //theme sẵn ACCESS_TOKEN để coi như page đã login thành công
  await context.addCookies([
    {
      name: "ACCESS_TOKEN",
      value: "33b3dc0b-81f5-4ba8-bbe5-e8b94fc71312",
      path: "/",
      domain: "alpha.tripi.vn",
    },
  ]);
  await page.goto("https://alpha.tripi.vn");
});

test.describe("book phòng khách sạn phạm hà", () => {
  test("search khách sạn phạm hà", async ({ page }) => {
    await page.getByRole("tab", { name: "Khách sạn" }).click();
    await page.getByPlaceholder("Chọn địa điểm").fill("KS Phạm Hà");
    await page.getByPlaceholder("Chọn địa điểm").press("Enter");
    await page.getByRole("heading", { name: "Địa điểm và khách sạn" }).click();
    await page.locator(".sc-kfGgVZ > div > svg").first().click();
    await page.getByPlaceholder("Chọn địa điểm").click();
    await page.screenshot({
      path: "1.png",
      fullPage: false,
    });
    await page.getByRole("button", { name: "search" }).click();
    // link đến trang khách sạn phạm hà
    //url : https://alpha.tripi.vn/hotel/detail?checkIn=29-01-2023&checkOut=30-01-2023&guestInfo=%7B%22roomCount%22%3A1%2C%22adultCount%22%3A2%2C%22childCount%22%3A0%2C%22childrenAges%22%3A%5B%5D%7D&hotelId=48644&direct=false
    const titleHotel = await page
      .getByRole("heading", { name: "KS Phạm Hà" })
      .first();
    await expect(titleHotel).toBeVisible();
    await page.getByRole("button", { name: "Chọn" }).nth(2).click();
    await expect(page).toHaveTitle("Đặt khách sạn: Điền thông tin");
    //điền vào danh bạ
    await page.getByRole("button", { name: "Thêm từ danh bạ" }).click();
    await page.getByText("vi hung0961592224").click();
    await page.screenshot({
      path: "2.png",
      fullPage: false,
    });
    //bấm nút chọn
    await page.getByRole("checkbox").first().check();
    await page.getByRole("button", { name: "Tiếp tục" }).click();
    await page.getByRole("heading", { name: "Thanh toán" }).first().click();
    await expect(page).toHaveTitle("Đặt phòng khách sạn: Thanh toán");
    // bỏ check chính xách hoàn hủy đi xem button có disable không
    await page.getByLabel("Đồng ý với các Điều khoản của Tripi").uncheck();
    const PayButton = await page.getByRole("button", { name: "Thanh toán" });
    await expect(PayButton).toBeDisabled();
    await page.getByLabel("Đồng ý với các Điều khoản của Tripi").check();
    await expect(PayButton).toBeEnabled();
    //bấm nút thanh toán check xem có mở popup xác nhận không
    await page.getByRole("button", { name: "Thanh toán" }).click();
    const confirmPopup = await page.getByRole("heading", { name: "Chú ý" });
    await expect(confirmPopup).toBeVisible();
    // bấm vào nút xác nhận. check xem có mở ra ô checkk OTP không
    await page.getByRole("button", { name: "Xác nhận" }).click();
    const OTPPopup = await page.getByRole("heading", {
      name: "Nhập Smart OTP",
    });
    await expect(OTPPopup).toBeVisible();
    await page.screenshot({
      path: "3.png",
      fullPage: false,
    });

    // điền mã otp mặc định là 1234
    await page.getByRole("textbox").click();
    await page.getByRole("textbox").fill("1234");
    // bấm nút thanh toán
    await page.getByRole("button", { name: "Thanh toán" }).click();
    await page.getByRole("heading", { name: "Giao dịch thành công" }).nth(1);
    //check xem có link đến trang giao dịch thành công hay không
    await expect(page).toHaveTitle("Giao dịch thành công");
    await page.screenshot({
      path: "4.png",
      fullPage: true,
    });
    // log ra mã đơn hàng
    await page.getByRole("button", { name: "Quản lý đơn hàng" }).click();
    await page
      .locator(
        "div:nth-child(3) > div:nth-child(2) > .sc-htoDjs > .MuiButtonBase-root"
      )
      .first()
      .click();
    console.log(await page.url());
    await page.screenshot({
      path: "5.png",
      fullPage: true,
    });
  });
});
