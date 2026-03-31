import DiscordProvider from "next-auth/providers/discord";

const requiredDiscordScopes = ["identify", "email"] as const;

type DiscordAuthEnvironment = Partial<
  Pick<
    NodeJS.ProcessEnv,
    "DISCORD_CLIENT_ID" | "DISCORD_CLIENT_SECRET" | "DISCORD_ADDITIONAL_SCOPES"
  >
>;

function getDiscordAuthEnvironment(
  env?: DiscordAuthEnvironment,
): DiscordAuthEnvironment {
  if (env) {
    return env;
  }

  return {
    DISCORD_ADDITIONAL_SCOPES: process.env.DISCORD_ADDITIONAL_SCOPES,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  };
}

export function isDiscordAuthEnabled(env?: DiscordAuthEnvironment) {
  const resolvedEnv = getDiscordAuthEnvironment(env);

  return Boolean(
    resolvedEnv.DISCORD_CLIENT_ID && resolvedEnv.DISCORD_CLIENT_SECRET,
  );
}

export function buildDiscordScope(additionalScopes?: string) {
  const optionalScopes = (additionalScopes ?? "")
    .split(/[\s,]+/)
    .map((scope) => scope.trim())
    .filter(Boolean)
    .filter(
      (scope, index, scopes) =>
        !requiredDiscordScopes.includes(
          scope as (typeof requiredDiscordScopes)[number],
        ) && scopes.indexOf(scope) === index,
    );

  return [...requiredDiscordScopes, ...optionalScopes].join(" ");
}

export function resolveDiscordAuthConfig(
  env?: DiscordAuthEnvironment,
) {
  const resolvedEnv = getDiscordAuthEnvironment(env);

  if (!isDiscordAuthEnabled(resolvedEnv)) {
    return null;
  }

  return {
    clientId: resolvedEnv.DISCORD_CLIENT_ID!,
    clientSecret: resolvedEnv.DISCORD_CLIENT_SECRET!,
    scope: buildDiscordScope(resolvedEnv.DISCORD_ADDITIONAL_SCOPES),
  };
}

export function createDiscordProvider(
  env?: DiscordAuthEnvironment,
) {
  const config = resolveDiscordAuthConfig(env);

  if (!config) {
    return null;
  }

  return DiscordProvider({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    authorization: {
      params: {
        scope: config.scope,
      },
    },
  });
}
