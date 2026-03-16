import { describe, expect, it } from "vitest";
import { sanitizeArticleContent } from "@/lib/article-payload";

describe("sanitizeArticleContent", () => {
  it("keeps supported formatting tags", () => {
    const html = "<p>Hello <strong>editor</strong></p>";

    expect(sanitizeArticleContent(html)).toBe("<p>Hello <strong>editor</strong></p>");
  });

  it("removes unsafe script tags", () => {
    const html = '<p>Safe</p><script>alert("xss")</script>';

    expect(sanitizeArticleContent(html)).toBe("<p>Safe</p>");
  });

  it("removes disallowed attributes while keeping safe links", () => {
    const html =
      '<a href="https://example.com" onclick="hack()" target="_blank">Read</a>';

    expect(sanitizeArticleContent(html)).toBe(
      '<a href="https://example.com" target="_blank">Read</a>',
    );
  });
});
