import { describe, expect, it } from "vitest";
import { buildExcerpt, normalizePage, slugify } from "@/lib/utils";

describe("slugify", () => {
  it("creates a URL-safe slug from a regular title", () => {
    expect(slugify("Building Editorial Calm with Next.js")).toBe(
      "building-editorial-calm-with-next-js",
    );
  });

  it("removes accents and repeated separators", () => {
    expect(slugify("Žluťoučký   kůň & Prisma")).toBe("zlutoucky-kun-and-prisma");
  });

  it("returns an empty string for non-word input", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("buildExcerpt", () => {
  it("strips html tags from editor content", () => {
    expect(buildExcerpt("<p>Hello <strong>world</strong></p>", 100)).toBe(
      "Hello world",
    );
  });

  it("truncates long content", () => {
    expect(buildExcerpt("<p>abcdefghijk</p>", 5)).toBe("abcde...");
  });
});

describe("normalizePage", () => {
  it("returns page 1 for invalid numbers", () => {
    expect(normalizePage("0")).toBe(1);
    expect(normalizePage("-3")).toBe(1);
    expect(normalizePage("NaN")).toBe(1);
  });

  it("accepts a positive integer page", () => {
    expect(normalizePage("4")).toBe(4);
  });
});
