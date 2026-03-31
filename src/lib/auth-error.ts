const authErrorMessages: Record<string, string> = {
  OAuthAccountNotLinked:
    "K tomuto e-mailu už existuje účet. Přihlaste se původní metodou a poté případně propojte Discord ručně.",
  OAuthSignin: "Přesměrování na Discord selhalo. Zkuste to znovu.",
  OAuthCallback: "Dokončení přihlášení přes Discord selhalo. Zkuste to znovu.",
  AccessDenied: "Přihlášení přes Discord bylo zrušeno nebo zamítnuto.",
  Configuration:
    "Discord přihlášení není správně nastavené. Zkontrolujte klientské ID, secret a redirect URI.",
  Default: "Přihlášení se nepodařilo. Zkuste to prosím znovu.",
};

export function resolveAuthErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return authErrorMessages[error] ?? authErrorMessages.Default;
}
