import { describe, expect, it } from "vitest";
import { loginSchema } from "@/lib/validation/auth";
import { formResolver } from "@/lib/validation/form-resolver";
import { articleSchema } from "@/lib/validation/article";

describe("formResolver", () => {
  it("returns no errors for valid payloads", () => {
    const validate = formResolver(loginSchema);

    expect(
      validate({
        email: "alice@example.com",
        password: "DemoPassword123!",
      }),
    ).toEqual({});
  });

  it("returns field errors for invalid scalar fields", () => {
    const validate = formResolver(loginSchema);

    expect(
      validate({
        email: "not-an-email",
        password: "short",
      }),
    ).toEqual({
      email: expect.any(String),
      password: expect.any(String),
    });
  });

  it("returns array-field errors without throwing for article validation", () => {
    const validate = formResolver(articleSchema);

    expect(
      validate({
        title: "A valid title",
        slug: "a-valid-title",
        excerpt: "",
        content: "<p>This body is definitely long enough.</p>",
        coverImage: "",
        categoryId: "cat_1",
        tagIds: new Array(11).fill("tag_1"),
        status: "DRAFT",
        publishDate: "2026-03-16T12:00",
      }),
    ).toEqual({
      tagIds: expect.any(String),
    });
  });
});
