import { test, expect } from "@playwright/test";

// ─── SEO & METADATA ─────────────────────────────────────────

test.describe("SEO", () => {
  test("home page has proper title", async ({ page }) => {
    await page.goto("/");
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(5);
  });

  test("home page has meta description", async ({ page }) => {
    await page.goto("/");
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toBeTruthy();
  });

  test("home page has Google Search Console verification meta tag", async ({
    page,
  }) => {
    await page.goto("/");
    const verification = await page
      .locator('meta[name="google-site-verification"]')
      .getAttribute("content");
    expect(verification).toBe("POxahttUfI0JvCBsFQmvxbP0SrkDdWF-g-j457jTOxk");
  });

  test("home page has OpenGraph meta tags", async ({ page }) => {
    await page.goto("/");
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle).toBeTruthy();
    const ogDescription = await page
      .locator('meta[property="og:description"]')
      .getAttribute("content");
    expect(ogDescription).toBeTruthy();
  });

  test("article page has dynamic metadata", async ({ page }) => {
    await page.goto("/");
    const firstLink = page.locator(".article-grid a").first();
    const href = await firstLink.getAttribute("href");
    await page.goto(href!);
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(5);
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle).toBeTruthy();
  });

  test("article page has canonical URL", async ({ page }) => {
    await page.goto("/");
    const firstLink = page.locator(".article-grid a").first();
    const href = await firstLink.getAttribute("href");
    await page.goto(href!);
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toBeTruthy();
    // Canonical should be a valid URL (may be base or article-specific)
    expect(canonical).toMatch(/^https?:\/\//);
  });

  test("sitemap.xml is accessible and valid", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("<url>");
    expect(body).toContain("<loc>");
    // Should contain home page
    expect(body).toContain("http");
    // Should contain article URLs
    expect(body).toContain("/articles/");
  });

  test("robots.txt is accessible and has correct rules", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("User-Agent");
    expect(body).toContain("Allow: /");
    expect(body).toContain("Disallow: /api/");
    expect(body).toContain("Disallow: /dashboard");
    expect(body).toContain("sitemap");
  });

  test("html lang attribute is set to cs", async ({ page }) => {
    await page.goto("/");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("cs");
  });
});
