import { siteConfig } from "@/lib/site";

type CookieConsentChangeHandler = () => void;

export function createCookieConsentConfig(onConsentChange: CookieConsentChangeHandler) {
  return {
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
      default: "cs",
      translations: {
        cs: {
          consentModal: {
            title: "Cookies pod kontrolou",
            description:
              "Inkspire používá nezbytné cookies pro běh aplikace a volitelnou analytiku Microsoft Clarity pro měření návštěvnosti. Clarity se spustí až po vašem souhlasu.",
            acceptAllBtn: "Povolit vše",
            acceptNecessaryBtn: "Jen nezbytné",
            showPreferencesBtn: "Nastavit volby",
          },
          preferencesModal: {
            title: "Nastavení cookies",
            acceptAllBtn: "Povolit vše",
            acceptNecessaryBtn: "Jen nezbytné",
            savePreferencesBtn: "Uložit volby",
            closeIconLabel: "Zavřít",
            sections: [
              {
                title: "Nezbytné",
                description:
                  "Nutné pro přihlášení, práci se session a základní fungování aplikace.",
                linkedCategory: "necessary",
              },
              {
                title: "Analytika",
                description:
                  "Volitelná analytika Microsoft Clarity pro ověření návštěv, heatmap a záznamů relací po nasazení.",
                linkedCategory: "analytics",
              },
            ],
          },
        },
      },
    },
    onConsent: onConsentChange,
    onChange: onConsentChange,
  };
}
