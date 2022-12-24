import { test, expect, type Page } from "@playwright/test";
import { searchQueries } from "./test";

for (const { search, searchQuerie } of searchQueries) {
  test(`Search function test ${search} `, async ({ page }: { page: Page }) => {
    // Navigate to the website
    await page.goto("https://soibien.vn/");

    await page.getByPlaceholder("Nhập từ khoá cần tìm").click();

    // Find the search input field and enter a query
    const searchInput: any = await page.getByPlaceholder(
      "Nhập từ khoá cần tìm"
    );
    await searchInput?.fill(search);

    // Find the search button and click it
    const searchButton: any = await page.getByRole("button", {
      name: "Search",
    });
    await searchButton?.click();

    // Wait for the search results to load
    // await page?.waitForSelector(".search-results");

    // Verify that the search results are displayed
    if (typeof searchQuerie == "number") {
      const productCards = await page.$$(".product-card");
      expect(productCards.length).toBe(searchQuerie);
    } else if (typeof searchQuerie == "string") {
      const locator = page.locator(".css-447dxq");
      await expect(locator).toContainText("Không tìm thấy sản phẩm nào");
    }
  });
}
