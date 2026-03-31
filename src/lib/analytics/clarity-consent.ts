export type ClarityStorageConsent = "granted" | "denied";

export type ClarityConsentOptions = {
  ad_Storage: ClarityStorageConsent;
  analytics_Storage: ClarityStorageConsent;
};

export type ClarityApi = {
  init: (projectId: string) => void;
  consentV2: (options: ClarityConsentOptions) => void;
};

export type ClarityWindowState = {
  __inkspireClarityInitialized?: boolean;
};

export function createClarityConsentOptions(granted: boolean): ClarityConsentOptions {
  const storageConsent: ClarityStorageConsent = granted ? "granted" : "denied";

  return {
    ad_Storage: storageConsent,
    analytics_Storage: storageConsent,
  };
}

export function syncClarityConsentState(
  clarity: ClarityApi,
  windowState: ClarityWindowState,
  projectId: string,
  granted: boolean,
) {
  const normalizedProjectId = projectId.trim();

  if (!normalizedProjectId) {
    throw new Error("Clarity project ID is required.");
  }

  if (!windowState.__inkspireClarityInitialized) {
    clarity.init(normalizedProjectId);
    windowState.__inkspireClarityInitialized = true;
  }

  clarity.consentV2(createClarityConsentOptions(granted));
}
