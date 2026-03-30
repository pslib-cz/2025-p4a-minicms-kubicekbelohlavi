import { test, expect } from "@playwright/test";

// ─── AUTHENTICATION ─────────────────────────────────────────

test.describe("Login page", () => {
  test("login page renders with email and password fields", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Heslo")).toBeVisible();
    await expect(page.getByRole("button", { name: "Přihlásit se" })).toBeVisible();
  });

  test("login page shows demo account hint", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("alice@example.com")).toBeVisible();
  });

  test("login page has link to registration", async ({ page }) => {
    await page.goto("/login");
    const registerLink = page.getByRole("link", {
      name: "Založte si ji tady.",
    });
    await expect(registerLink).toBeVisible();
  });

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("wrong@example.com");
    await page.getByLabel("Heslo").fill("wrongpassword");
    await page.getByRole("button", { name: "Přihlásit se" }).click();
    // Should show an error message
    await expect(
      page.locator(".mantine-Alert-root, [role='alert']").first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("successful login redirects to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("alice@example.com");
    await page.getByLabel("Heslo").fill("DemoPassword123!");
    await page.getByRole("button", { name: "Přihlásit se" }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });
});

test.describe("Register page", () => {
  test("register page renders with all fields", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByLabel("Jméno")).toBeVisible();
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Heslo")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Vytvořit účet" })
    ).toBeVisible();
  });

  test("register page has link to login", async ({ page }) => {
    await page.goto("/register");
    const loginLink = page.getByRole("link", {
      name: "Přejděte na přihlášení.",
    });
    await expect(loginLink).toBeVisible();
  });

  test("register with existing email shows error", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Jméno").fill("Alice");
    await page.getByLabel("E-mail").fill("alice@example.com");
    await page.getByLabel("Heslo").fill("SomePassword123!");
    await page.getByRole("button", { name: "Vytvořit účet" }).click();
    // Should show duplicate email error
    await expect(
      page.locator(".mantine-Alert-root, [role='alert']").first()
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Dashboard protection", () => {
  test("unauthenticated user is redirected from dashboard to login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
