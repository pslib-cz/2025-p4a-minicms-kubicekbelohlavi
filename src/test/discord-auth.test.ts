import { describe, expect, it } from "vitest";
import {
  buildDiscordScope,
  isDiscordAuthEnabled,
  resolveDiscordAuthConfig,
} from "@/lib/discord-auth";

describe("buildDiscordScope", () => {
  it("always includes the minimum identity scopes", () => {
    expect(buildDiscordScope()).toBe("identify email");
  });

  it("merges additional scopes and removes duplicates", () => {
    expect(buildDiscordScope("connections email, guilds connections")).toBe(
      "identify email connections guilds",
    );
  });

  it("ignores blank additional scope values", () => {
    expect(buildDiscordScope("   ,   ")).toBe("identify email");
  });
});

describe("isDiscordAuthEnabled", () => {
  it("returns true only when both required Discord secrets are present", () => {
    expect(
      isDiscordAuthEnabled({
        DISCORD_CLIENT_ID: "client-id",
        DISCORD_CLIENT_SECRET: "client-secret",
      }),
    ).toBe(true);
    expect(isDiscordAuthEnabled({ DISCORD_CLIENT_ID: "client-id" })).toBe(false);
  });
});

describe("resolveDiscordAuthConfig", () => {
  it("returns a complete OAuth config when Discord auth is enabled", () => {
    expect(
      resolveDiscordAuthConfig({
        DISCORD_ADDITIONAL_SCOPES: "connections",
        DISCORD_CLIENT_ID: "client-id",
        DISCORD_CLIENT_SECRET: "client-secret",
      }),
    ).toEqual({
      clientId: "client-id",
      clientSecret: "client-secret",
      scope: "identify email connections",
    });
  });

  it("returns null when Discord auth is not configured", () => {
    expect(resolveDiscordAuthConfig({})).toBeNull();
  });
});
