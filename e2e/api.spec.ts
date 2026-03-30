import { test, expect } from "@playwright/test";

// ─── API ROUTE HANDLERS ─────────────────────────────────────

test.describe("API - unauthenticated access", () => {
  test("GET /api/dashboard/articles returns 401 without session", async ({
    request,
  }) => {
    const response = await request.get("/api/dashboard/articles");
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test("POST /api/dashboard/articles returns 401 without session", async ({
    request,
  }) => {
    const response = await request.post("/api/dashboard/articles", {
      data: { title: "Test" },
    });
    expect(response.status()).toBe(401);
  });

  test("GET /api/dashboard/categories returns 401 without session", async ({
    request,
  }) => {
    const response = await request.get("/api/dashboard/categories");
    expect(response.status()).toBe(401);
  });

  test("GET /api/dashboard/tags returns 401 without session", async ({
    request,
  }) => {
    const response = await request.get("/api/dashboard/tags");
    expect(response.status()).toBe(401);
  });
});

test.describe("API - registration", () => {
  test("POST /api/auth/register validates input", async ({ request }) => {
    const response = await request.post("/api/auth/register", {
      data: { name: "", email: "invalid", password: "short" },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test("POST /api/auth/register rejects duplicate email", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/register", {
      data: {
        name: "Test",
        email: "alice@example.com",
        password: "StrongPassword123!",
      },
    });
    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });
});

test.describe("API - server-side validation", () => {
  test("PATCH /api/dashboard/articles/nonexistent returns error", async ({
    request,
  }) => {
    const response = await request.patch(
      "/api/dashboard/articles/nonexistent-id",
      {
        data: { title: "Updated" },
      }
    );
    // Should be 401 (unauthenticated) or 404
    expect([401, 404]).toContain(response.status());
  });

  test("DELETE /api/dashboard/articles/nonexistent returns error", async ({
    request,
  }) => {
    const response = await request.delete(
      "/api/dashboard/articles/nonexistent-id"
    );
    expect([401, 404]).toContain(response.status());
  });
});
