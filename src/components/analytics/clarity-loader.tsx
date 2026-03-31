"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";
import * as CookieConsent from "vanilla-cookieconsent";
import { syncClarityConsentState } from "@/lib/analytics/clarity-consent";

declare global {
  interface Window {
    __inkspireClarityInitialized?: boolean;
  }
}

function hasAnalyticsConsent() {
  try {
    return CookieConsent.acceptedCategory("analytics");
  } catch {
    return false;
  }
}

function syncClarityConsent(projectId: string) {
  syncClarityConsentState(Clarity, window, projectId, hasAnalyticsConsent());
}

export function ClarityLoader() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_ID?.trim();

  useEffect(() => {
    if (!projectId) {
      return;
    }

    const handleConsentChange = () => {
      syncClarityConsent(projectId);
    };

    handleConsentChange();
    window.addEventListener("analytics-consent-changed", handleConsentChange);
    window.addEventListener("cc:onConsent", handleConsentChange as EventListener);
    window.addEventListener("cc:onChange", handleConsentChange as EventListener);

    return () => {
      window.removeEventListener("analytics-consent-changed", handleConsentChange);
      window.removeEventListener("cc:onConsent", handleConsentChange as EventListener);
      window.removeEventListener("cc:onChange", handleConsentChange as EventListener);
    };
  }, [projectId]);

  return null;
}
