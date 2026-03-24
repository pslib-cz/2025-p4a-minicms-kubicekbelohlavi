import { describe, expect, it } from "vitest";
import {
  formatArticleCount,
  formatIssueLabel,
  formatPanelNumber,
} from "@/lib/magazine";

describe("formatIssueLabel", () => {
  it("formats issue stamps in Czech month-year style", () => {
    expect(formatIssueLabel("2026-03-10T06:50:00.000Z")).toBe("březen 2026");
  });
});

describe("formatArticleCount", () => {
  it("uses the singular form for one article", () => {
    expect(formatArticleCount(1)).toBe("1 článek");
  });

  it("uses the few form for low counts", () => {
    expect(formatArticleCount(3)).toBe("3 články");
  });

  it("uses the many form for teen counts", () => {
    expect(formatArticleCount(12)).toBe("12 článků");
  });
});

describe("formatPanelNumber", () => {
  it("pads panel numbers to two digits", () => {
    expect(formatPanelNumber(0)).toBe("01");
    expect(formatPanelNumber(11)).toBe("12");
  });
});
