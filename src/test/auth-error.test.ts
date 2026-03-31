import { describe, expect, it } from "vitest";
import { resolveAuthErrorMessage } from "@/lib/auth-error";

describe("resolveAuthErrorMessage", () => {
  it("maps the account-not-linked error to a helpful message", () => {
    expect(resolveAuthErrorMessage("OAuthAccountNotLinked")).toContain(
      "K tomuto e-mailu už existuje účet.",
    );
  });

  it("maps Discord OAuth callback errors", () => {
    expect(resolveAuthErrorMessage("OAuthCallback")).toBe(
      "Dokončení přihlášení přes Discord selhalo. Zkuste to znovu.",
    );
    expect(resolveAuthErrorMessage("AccessDenied")).toBe(
      "Přihlášení přes Discord bylo zrušeno nebo zamítnuto.",
    );
  });

  it("returns null for empty input and a fallback for unknown errors", () => {
    expect(resolveAuthErrorMessage()).toBeNull();
    expect(resolveAuthErrorMessage("SomethingElse")).toBe(
      "Přihlášení se nepodařilo. Zkuste to prosím znovu.",
    );
  });
});
