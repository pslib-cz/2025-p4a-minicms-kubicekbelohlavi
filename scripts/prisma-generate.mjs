import { execFileSync } from "node:child_process";

function normalizeDatabaseUrl(databaseUrl) {
  const trimmed = databaseUrl?.trim();

  return trimmed && trimmed.length > 0 ? trimmed : "file:./dev.db";
}

function getPrismaSchemaPath(databaseUrl) {
  const normalizedDatabaseUrl = normalizeDatabaseUrl(databaseUrl);

  if (normalizedDatabaseUrl.startsWith("file:")) {
    return "prisma/schema.prisma";
  }

  if (
    normalizedDatabaseUrl.startsWith("postgres://") ||
    normalizedDatabaseUrl.startsWith("postgresql://") ||
    normalizedDatabaseUrl.startsWith("prisma+postgres://")
  ) {
    return "prisma/schema.postgres.prisma";
  }

  throw new Error(`Unsupported DATABASE_URL protocol: ${normalizedDatabaseUrl}`);
}

const schemaPath = getPrismaSchemaPath(process.env.DATABASE_URL);
const command = process.platform === "win32" ? "npx.cmd" : "npx";

execFileSync(command, ["prisma", "generate", "--schema", schemaPath], {
  stdio: "inherit",
});
