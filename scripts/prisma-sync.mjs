import { execFileSync } from "node:child_process";

function normalizeDatabaseUrl(databaseUrl) {
  const trimmed = databaseUrl?.trim();

  return trimmed && trimmed.length > 0 ? trimmed : "file:./dev.db";
}

function isPostgresDatabaseUrl(databaseUrl) {
  const normalizedDatabaseUrl = normalizeDatabaseUrl(databaseUrl);

  return (
    normalizedDatabaseUrl.startsWith("postgres://") ||
    normalizedDatabaseUrl.startsWith("postgresql://") ||
    normalizedDatabaseUrl.startsWith("prisma+postgres://")
  );
}

if (!isPostgresDatabaseUrl(process.env.DATABASE_URL)) {
  console.log("Skipping Prisma schema sync for SQLite/local DATABASE_URL.");
  process.exit(0);
}

const command = process.platform === "win32" ? "npx.cmd" : "npx";

execFileSync(
  command,
  ["prisma", "db", "push", "--schema", "prisma/schema.postgres.prisma"],
  {
    stdio: "inherit",
  },
);
