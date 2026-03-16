"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";
import * as CookieConsent from "vanilla-cookieconsent";

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
  const granted = hasAnalyticsConsent();

  if (granted && !window.__inkspireClarityInitialized) {
    Clarity.init(projectId);
    window.__inkspireClarityInitialized = true;
  }

  if (window.__inkspireClarityInitialized) {
    Clarity.consentV2({
      ad_Storage: granted ? "granted" : "denied",
      analytics_Storage: granted ? "granted" : "denied",
    });
  }
}

export function ClarityLoader() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_ID;

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
