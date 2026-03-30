import { describe, expect, it } from "vitest";
import {
  comicFontStacks,
  comicLibraryRecommendations,
  comicThemeColors,
} from "@/lib/theme/comic-theme";

describe("comicThemeColors", () => {
  it("defines full 10-step palettes for the comic accents", () => {
    expect(comicThemeColors.heroRed).toHaveLength(10);
    expect(comicThemeColors.heroBlue).toHaveLength(10);
    expect(comicThemeColors.heroYellow).toHaveLength(10);
  });

  it("keeps the primary comic red accent in the middle shade", () => {
    expect(comicThemeColors.heroRed[5]).toBe("#e23636");
  });

  it("keeps a dark ink palette for borders and typography", () => {
    expect(comicThemeColors.heroInk[8]).toBe("#1a1a1a");
  });
});

describe("comicLibraryRecommendations", () => {
  it("adopts Mantine and next/font/google as the foundation", () => {
    const adopted = comicLibraryRecommendations.filter((entry) => entry.adopt);

    expect(adopted.map((entry) => entry.name)).toEqual([
      "Mantine",
      "next/font/google",
    ]);
  });

  it("rejects rough-notation because its release cadence is stale", () => {
    expect(
      comicLibraryRecommendations.find((entry) => entry.name === "rough-notation")
        ?.note,
    ).toContain("2022");
  });

  it("keeps the comic font stacks wired to CSS variables", () => {
    expect(comicFontStacks.body).toContain("--font-body");
    expect(comicFontStacks.heading).toContain("--font-heading");
  });
});
