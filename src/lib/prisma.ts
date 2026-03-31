import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient, type Prisma } from "@prisma/client";
import { isSqliteDatabaseUrl, normalizeDatabaseUrl } from "@/lib/prisma-runtime";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);
const log: Prisma.LogLevel[] =
  process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

function createPrismaClient() {
  if (isSqliteDatabaseUrl(databaseUrl)) {
    return new PrismaClient({
      adapter: new PrismaBetterSqlite3({ url: databaseUrl }),
      log,
    });
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
    log,
  });
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
