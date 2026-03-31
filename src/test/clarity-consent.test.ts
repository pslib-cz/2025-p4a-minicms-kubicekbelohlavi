import { describe, expect, it, vi } from "vitest";
import {
  createClarityConsentOptions,
  syncClarityConsentState,
  type ClarityApi,
  type ClarityWindowState,
} from "@/lib/analytics/clarity-consent";

function createClarityMock(): ClarityApi {
  return {
    init: vi.fn(),
    consentV2: vi.fn(),
  };
}

describe("clarity consent helpers", () => {
  it("initializes Clarity and grants storage when analytics consent is enabled", () => {
    const clarity = createClarityMock();
    const windowState: ClarityWindowState = {};

    syncClarityConsentState(clarity, windowState, "w3qe05gy45", true);

    expect(clarity.init).toHaveBeenCalledWith("w3qe05gy45");
    expect(clarity.consentV2).toHaveBeenCalledWith({
      ad_Storage: "granted",
      analytics_Storage: "granted",
    });
    expect(windowState.__inkspireClarityInitialized).toBe(true);
  });

  it("updates denied consent without reinitializing an existing Clarity instance", () => {
    const clarity = createClarityMock();
    const windowState: ClarityWindowState = {
      __inkspireClarityInitialized: true,
    };

    syncClarityConsentState(clarity, windowState, "w3qe05gy45", false);

    expect(clarity.init).not.toHaveBeenCalled();
    expect(clarity.consentV2).toHaveBeenCalledWith(createClarityConsentOptions(false));
  });

  it("rejects an empty Clarity project ID", () => {
    const clarity = createClarityMock();
    const windowState: ClarityWindowState = {};

    expect(() =>
      syncClarityConsentState(clarity, windowState, "   ", true),
    ).toThrowError("Clarity project ID is required.");
    expect(clarity.init).not.toHaveBeenCalled();
    expect(clarity.consentV2).not.toHaveBeenCalled();
  });
});
