import { describe, expect, it } from "vitest";
import { clampPage, toDatetimeLocalValue } from "@/lib/utils";
import { taxonomySchema } from "@/lib/validation/taxonomy";

describe("taxonomySchema", () => {
  it("accepts a valid taxonomy payload", () => {
    const parsed = taxonomySchema.safeParse({
      name: "Workflows",
      slug: "workflows",
    });

    expect(parsed.success).toBe(true);
  });

  it("allows an empty slug so the server can generate one", () => {
    const parsed = taxonomySchema.safeParse({
      name: "Photography",
      slug: "",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects names that are too short", () => {
    const parsed = taxonomySchema.safeParse({
      name: "A",
      slug: "a",
    });

    expect(parsed.success).toBe(false);
  });
});

describe("clampPage", () => {
  it("clamps values below one", () => {
    expect(clampPage(0, 5)).toBe(1);
  });

  it("clamps values above the last page", () => {
    expect(clampPage(8, 3)).toBe(3);
  });
});

describe("toDatetimeLocalValue", () => {
  it("returns a datetime-local formatted string", () => {
    expect(toDatetimeLocalValue("2026-03-16T12:34:56.000Z")).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
    );
  });
});
