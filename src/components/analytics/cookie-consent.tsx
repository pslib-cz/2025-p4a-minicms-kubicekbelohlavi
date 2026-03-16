"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { siteConfig } from "@/lib/site";

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

    void CookieConsent.run({
      revision: siteConfig.consentRevision,
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          autoClear: {
            cookies: [
              { name: "_clck" },
              { name: "_clsk" },
              { name: "CLID" },
              { name: "ANONCHK" },
              { name: "MR" },
              { name: "MUID" },
              { name: "SM" },
            ],
          },
        },
      },
      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title: "Cookies with restraint",
              description:
                "Inkspire uses essential cookies to keep the app working and optional Microsoft Clarity analytics to measure page views and user behavior. Clarity starts only after consent.",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject optional",
              showPreferencesBtn: "Choose preferences",
            },
            preferencesModal: {
              title: "Cookie preferences",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject optional",
              savePreferencesBtn: "Save preferences",
              closeIconLabel: "Close",
              sections: [
                {
                  title: "Strictly necessary",
                  description:
                    "Required for authentication, session handling, and core application behavior.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analytics",
                  description:
                    "Optional Microsoft Clarity tracking used to verify page views, heatmaps, and session recordings after deployment.",
                  linkedCategory: "analytics",
                },
              ],
            },
          },
        },
      },
      onConsent: () => {
        window.dispatchEvent(new Event("analytics-consent-changed"));
      },
      onChange: () => {
        window.dispatchEvent(new Event("analytics-consent-changed"));
      },
    });
  }, []);

  return null;
}
