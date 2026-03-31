import { describe, expect, it } from "vitest";
import {
  getPrismaSchemaPath,
  isPostgresDatabaseUrl,
  isSqliteDatabaseUrl,
  normalizeDatabaseUrl,
  shouldSyncDatabaseSchema,
} from "@/lib/prisma-runtime";

describe("prisma runtime helpers", () => {
  it("uses SQLite defaults when DATABASE_URL is missing", () => {
    expect(normalizeDatabaseUrl(undefined)).toBe("file:./dev.db");
    expect(isSqliteDatabaseUrl(undefined)).toBe(true);
    expect(getPrismaSchemaPath(undefined)).toBe("prisma/schema.prisma");
  });

  it("switches to the PostgreSQL schema for deployment URLs", () => {
    expect(isSqliteDatabaseUrl("postgresql://user:pass@host:5432/app")).toBe(false);
    expect(isPostgresDatabaseUrl("postgresql://user:pass@host:5432/app")).toBe(true);
    expect(getPrismaSchemaPath("postgresql://user:pass@host:5432/app")).toBe(
      "prisma/schema.postgres.prisma",
    );
    expect(getPrismaSchemaPath("prisma+postgres://accelerate.example")).toBe(
      "prisma/schema.postgres.prisma",
    );
  });

  it("syncs the schema only for PostgreSQL deployment URLs", () => {
    expect(shouldSyncDatabaseSchema(undefined)).toBe(false);
    expect(shouldSyncDatabaseSchema("file:./dev.db")).toBe(false);
    expect(shouldSyncDatabaseSchema("postgres://user:pass@host:5432/app")).toBe(true);
  });

  it("rejects unsupported database protocols", () => {
    expect(() => getPrismaSchemaPath("mysql://user:pass@host:3306/app")).toThrowError(
      "Unsupported DATABASE_URL protocol: mysql://user:pass@host:3306/app",
    );
  });
});
