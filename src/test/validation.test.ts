import { describe, expect, it } from "vitest";
import { registerSchema } from "@/lib/validation/auth";
import { articleSchema } from "@/lib/validation/article";

describe("registerSchema", () => {
  it("accepts a valid registration payload", () => {
    const parsed = registerSchema.safeParse({
      name: "Alice Editor",
      email: "alice@example.com",
      password: "DemoPassword123!",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects too-short passwords", () => {
    const parsed = registerSchema.safeParse({
      name: "Alice Editor",
      email: "alice@example.com",
      password: "short",
    });

    expect(parsed.success).toBe(false);
  });
});

describe("articleSchema", () => {
  it("accepts a valid article payload", () => {
    const parsed = articleSchema.safeParse({
      title: "A valid title",
      slug: "a-valid-title",
      excerpt: "A short summary",
      content: "<p>This body is definitely long enough.</p>",
      coverImage: "https://images.unsplash.com/photo-example",
      categoryId: "cat_1",
      tagIds: ["tag_1"],
      status: "DRAFT",
      publishDate: "2026-03-16T12:00",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects content that is too short", () => {
    const parsed = articleSchema.safeParse({
      title: "A valid title",
      slug: "a-valid-title",
      excerpt: "",
      content: "<p>short</p>",
      coverImage: "",
      categoryId: "cat_1",
      tagIds: [],
      status: "DRAFT",
      publishDate: "2026-03-16T12:00",
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects invalid cover image urls", () => {
    const parsed = articleSchema.safeParse({
      title: "A valid title",
      slug: "a-valid-title",
      excerpt: "",
      content: "<p>This body is definitely long enough.</p>",
      coverImage: "not-a-url",
      categoryId: "cat_1",
      tagIds: [],
      status: "PUBLISHED",
      publishDate: "2026-03-16T12:00",
    });

    expect(parsed.success).toBe(false);
  });
});
