import { describe, expect, it, vi } from "vitest";
import {
  isRecoverableAuthSessionError,
  resolveSessionSafely,
  shouldIgnoreAuthLoggerError,
} from "@/lib/auth-session";

describe("isRecoverableAuthSessionError", () => {
  it("recognizes a stale encrypted session cookie error", () => {
    expect(
      isRecoverableAuthSessionError(
        new Error("decryption operation failed", {
          cause: { name: "JWEDecryptionFailed" },
        }),
      ),
    ).toBe(true);
  });

  it("recognizes invalid compact JWE payloads from the NextAuth logger", () => {
    expect(
      shouldIgnoreAuthLoggerError("JWT_SESSION_ERROR", {
        name: "JWEInvalid",
        message: "Invalid Compact JWE",
      }),
    ).toBe(true);
  });

  it("does not silence unrelated authentication failures", () => {
    expect(
      isRecoverableAuthSessionError(new Error("Database connection refused")),
    ).toBe(false);
    expect(
      shouldIgnoreAuthLoggerError("OAUTH_CALLBACK_ERROR", {
        message: "decryption operation failed",
      }),
    ).toBe(false);
  });
});

describe("resolveSessionSafely", () => {
  it("returns the resolved session for a valid token", async () => {
    const loadSession = vi.fn().mockResolvedValue({ user: { id: "user-1" } });

    await expect(resolveSessionSafely(loadSession)).resolves.toEqual({
      user: { id: "user-1" },
    });
  });

  it("returns null when the session token cannot be decrypted", async () => {
    const loadSession = vi.fn().mockRejectedValue(
      Object.assign(new Error("decryption operation failed"), {
        name: "JWEDecryptionFailed",
      }),
    );

    await expect(resolveSessionSafely(loadSession)).resolves.toBeNull();
  });

  it("rethrows unexpected session loader errors", async () => {
    const loadSession = vi.fn().mockRejectedValue(new Error("Prisma failed"));

    await expect(resolveSessionSafely(loadSession)).rejects.toThrow("Prisma failed");
  });
});
