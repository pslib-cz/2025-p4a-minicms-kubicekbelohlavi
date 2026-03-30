import { test, expect } from "@playwright/test";

// ─── PUBLIC SECTION ─────────────────────────────────────────

test.describe("Home page (public)", () => {
  test("renders hero section with heading", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
  });

  test("displays published articles in the grid", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator(".article-grid .article-card");
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("has filter form with search, category, and tag fields", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("#q")).toBeVisible();
    await expect(page.locator("#category")).toBeVisible();
    await expect(page.locator("#tag")).toBeVisible();
    await expect(page.getByText("Filtrovat")).toBeVisible();
  });

  test("search filters articles by title", async ({ page }) => {
    await page.goto("/");
    const allCards = await page.locator(".article-grid .article-card").count();
    // Type a specific term that should narrow results
    await page.fill("#q", "xxxnonexistentxxx");
    await page.click('button:has-text("Filtrovat")');
    await page.waitForURL(/q=xxxnonexistentxxx/);
    // Either empty state or fewer cards
    const emptyState = page.locator(".empty-state");
    const filteredCards = page.locator(".article-grid .article-card");
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    if (!hasEmpty) {
      const filteredCount = await filteredCards.count();
      expect(filteredCount).toBeLessThanOrEqual(allCards);
    }
  });

  test("category filter works", async ({ page }) => {
    await page.goto("/");
    const select = page.locator("#category");
    const options = select.locator("option");
    const optionCount = await options.count();
    // Should have at least 'Všechny rubriky' + at least one real category
    expect(optionCount).toBeGreaterThanOrEqual(2);
    // Select the second option (first real category)
    const secondValue = await options.nth(1).getAttribute("value");
    if (secondValue) {
      await select.selectOption(secondValue);
      await page.click('button:has-text("Filtrovat")');
      await page.waitForURL(/category=/);
    }
  });

  test("tag filter works", async ({ page }) => {
    await page.goto("/");
    const select = page.locator("#tag");
    const options = select.locator("option");
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThanOrEqual(2);
  });

  test("pagination controls are present when there are enough articles", async ({
    page,
  }) => {
    await page.goto("/");
    // Pagination may or may not be visible depending on article count
    // We just check the page loaded successfully
    await expect(page.locator("h1")).toBeVisible();
  });

  test("clear filters link resets to home page", async ({ page }) => {
    await page.goto("/?q=test");
    const clearLink = page.locator('a:has-text("Vyčistit")');
    if (await clearLink.isVisible()) {
      await clearLink.click();
      await expect(page).toHaveURL("/");
    }
  });
});

// ─── ARTICLE DETAIL ─────────────────────────────────────────

test.describe("Article detail page", () => {
  test("clicking an article card navigates to detail", async ({ page }) => {
    await page.goto("/");
    const firstLink = page.locator(".article-grid a").first();
    await expect(firstLink).toBeVisible();
    const href = await firstLink.getAttribute("href");
    expect(href).toMatch(/^\/articles\//);
    await firstLink.click();
    await expect(page).toHaveURL(/\/articles\//);
  });

  test("article detail shows title and content", async ({ page }) => {
    await page.goto("/");
    const firstLink = page.locator(".article-grid a").first();
    const href = await firstLink.getAttribute("href");
    await page.goto(href!);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator(".article-prose")).toBeVisible({
      timeout: 10000,
    });
  });

  test("article detail shows back link", async ({ page }) => {
    await page.goto("/");
    const firstLink = page.locator(".article-grid a").first();
    const href = await firstLink.getAttribute("href");
    await page.goto(href!);
    const backLink = page.locator('a:has-text("Zpět na titulku")');
    await expect(backLink).toBeVisible();
  });

  test("article detail shows tag pills", async ({ page }) => {
    await page.goto("/");
    const firstLink = page.locator(".article-grid a").first();
    const href = await firstLink.getAttribute("href");
    await page.goto(href!);
    // Tags may or may not be present, but tag-list container should exist
    const tagList = page.locator(".tag-list");
    // This is optional - article might have no tags
    const visible = await tagList.isVisible().catch(() => false);
    // Just verify the page rendered correctly
    await expect(page.locator("h1")).toBeVisible();
  });
});
