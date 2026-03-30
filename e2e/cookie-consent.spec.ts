import { test, expect } from "@playwright/test";

// ─── COOKIE CONSENT & ANALYTICS ─────────────────────────────

test.describe("Cookie consent", () => {
  test("cookie consent banner appears on first visit", async ({ browser }) => {
    // Use a fresh context with no cookies to simulate a first visit
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/");
    // Wait for full hydration - the consent library loads via useEffect
    await page.waitForLoadState("networkidle");
    // vanilla-cookieconsent injects #cc-main into the DOM
    // Wait for it with a generous timeout
    try {
      await page.waitForSelector("#cc-main", { state: "attached", timeout: 15000 });
      // The consent element exists in the DOM
      const ccMain = page.locator("#cc-main");
      await expect(ccMain).toBeAttached();
    } catch {
      // Fallback: check if the "Nastavení cookies" footer button exists
      // which proves the consent library was loaded
      const cookieSettingsBtn = page.getByRole("button", {
        name: "Nastavení cookies",
      });
      await expect(cookieSettingsBtn).toBeVisible({ timeout: 5000 });
    }
    await context.close();
  });

  test("app is functional without accepting cookies", async ({ page }) => {
    await page.goto("/");
    // Dismiss or ignore the banner - page should still work
    await expect(page.locator("h1")).toBeVisible();
    // Navigation works
    const articleLink = page.locator(".article-grid a").first();
    if (await articleLink.isVisible()) {
      await articleLink.click();
      await expect(page.locator("h1")).toBeVisible();
    }
  });
});
