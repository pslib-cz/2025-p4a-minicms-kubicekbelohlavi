"use client";

import * as CookieConsent from "vanilla-cookieconsent";

export function CookieSettingsButton() {
  return (
    <button
      className="footer-link-button"
      onClick={() => CookieConsent.showPreferences()}
      type="button"
    >
      Nastavení cookies
    </button>
  );
}
