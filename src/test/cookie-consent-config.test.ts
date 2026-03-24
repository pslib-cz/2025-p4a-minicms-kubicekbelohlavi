import { describe, expect, it, vi } from "vitest";
import { createCookieConsentConfig } from "@/lib/analytics/cookie-consent-config";
import { siteConfig } from "@/lib/site";

describe("createCookieConsentConfig", () => {
  it("uses the current site consent revision and Czech translations", () => {
    const config = createCookieConsentConfig(() => undefined);

    expect(config.revision).toBe(siteConfig.consentRevision);
    expect(config.language.default).toBe("cs");
    expect(config.language.translations.cs.consentModal.title).toContain("Cookies");
  });

  it("keeps necessary cookies locked and clears Clarity cookies from analytics", () => {
    const config = createCookieConsentConfig(() => undefined);

    expect(config.categories.necessary.enabled).toBe(true);
    expect(config.categories.necessary.readOnly).toBe(true);
    expect(config.categories.analytics.autoClear.cookies).toEqual(
      expect.arrayContaining([{ name: "_clck" }, { name: "MUID" }]),
    );
  });

  it("reuses the provided callback for consent updates", () => {
    const onConsentChange = vi.fn();
    const config = createCookieConsentConfig(onConsentChange);

    config.onConsent();
    config.onChange();

    expect(onConsentChange).toHaveBeenCalledTimes(2);
  });
});
