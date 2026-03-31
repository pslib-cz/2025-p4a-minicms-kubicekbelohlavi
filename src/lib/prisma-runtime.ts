const SQLITE_URL_PREFIX = "file:";
const POSTGRES_PROTOCOLS = ["postgres://", "postgresql://", "prisma+postgres://"] as const;

export function normalizeDatabaseUrl(databaseUrl?: string) {
  const trimmed = databaseUrl?.trim();

  return trimmed && trimmed.length > 0 ? trimmed : "file:./dev.db";
}

export function isSqliteDatabaseUrl(databaseUrl?: string) {
  return normalizeDatabaseUrl(databaseUrl).startsWith(SQLITE_URL_PREFIX);
}

export function isPostgresDatabaseUrl(databaseUrl?: string) {
  const normalizedDatabaseUrl = normalizeDatabaseUrl(databaseUrl);

  return POSTGRES_PROTOCOLS.some((protocol) => normalizedDatabaseUrl.startsWith(protocol));
}

export function getPrismaSchemaPath(databaseUrl?: string) {
  const normalizedDatabaseUrl = normalizeDatabaseUrl(databaseUrl);

  if (isSqliteDatabaseUrl(normalizedDatabaseUrl)) {
    return "prisma/schema.prisma";
  }

  if (isPostgresDatabaseUrl(normalizedDatabaseUrl)) {
    return "prisma/schema.postgres.prisma";
  }

  throw new Error(`Unsupported DATABASE_URL protocol: ${normalizedDatabaseUrl}`);
}

export function shouldSyncDatabaseSchema(databaseUrl?: string) {
  return isPostgresDatabaseUrl(databaseUrl);
}
