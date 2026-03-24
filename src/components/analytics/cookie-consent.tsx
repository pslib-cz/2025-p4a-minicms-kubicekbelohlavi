"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { createCookieConsentConfig } from "@/lib/analytics/cookie-consent-config";

declare global {
  interface Window {
    __inkspireConsentReady?: boolean;
  }
}

export function CookieConsentBanner() {
  useEffect(() => {
    if (window.__inkspireConsentReady) {
      return;
    }

    window.__inkspireConsentReady = true;

    void CookieConsent.run(
      createCookieConsentConfig(() => {
        window.dispatchEvent(new Event("analytics-consent-changed"));
      }),
    );
  }, []);

  return null;
}
