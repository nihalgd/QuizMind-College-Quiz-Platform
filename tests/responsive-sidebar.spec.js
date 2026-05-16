import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile-320", width: 320, height: 760 },
  { name: "tablet-768", width: 768, height: 900 },
  { name: "desktop-1366", width: 1366, height: 900 },
];

const assertNoHorizontalOverflow = async (page) => {
  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));

  expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
  expect(widths.body).toBeLessThanOrEqual(widths.viewport + 1);
};

const loginAsStudent = async (page) => {
  await page.goto("http://127.0.0.1:5173/");
  await page.getByRole("button", { name: /Student:/ }).click();
  await page.getByRole("button", { name: /^Sign In$/ }).click();
  await page.waitForURL("**/student/dashboard");
};

for (const viewport of viewports) {
  test(`sidebar layout at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await loginAsStudent(page);

    const sidebar = page.getByTestId("app-sidebar");
    const overlay = page.getByTestId("sidebar-overlay");

    await assertNoHorizontalOverflow(page);

    if (viewport.width >= 1024) {
      const sidebarBox = await sidebar.boundingBox();
      const headerBox = await page.locator("header").boundingBox();

      expect(Math.round(sidebarBox.width)).toBe(260);
      expect(Math.round(sidebarBox.x)).toBe(0);
      expect(Math.round(headerBox.x)).toBe(260);
      await expect(page.getByRole("button", { name: "Open sidebar" })).toBeHidden();
      return;
    }

    let sidebarBox = await sidebar.boundingBox();
    expect(Math.round(sidebarBox.width)).toBe(280);
    expect(sidebarBox.x).toBeLessThan(-250);
    await expect(overlay).toHaveCSS("pointer-events", "none");

    await page.getByRole("button", { name: "Open sidebar" }).click();
    await page.waitForTimeout(350);

    sidebarBox = await sidebar.boundingBox();
    expect(Math.round(sidebarBox.x)).toBe(0);
    await expect(overlay).toHaveCSS("pointer-events", "auto");
    await assertNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "Dashboard" }).click();
    await page.waitForTimeout(350);

    sidebarBox = await sidebar.boundingBox();
    expect(sidebarBox.x).toBeLessThan(-250);
    await expect(overlay).toHaveCSS("pointer-events", "none");
    await assertNoHorizontalOverflow(page);
  });
}
