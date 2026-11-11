import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Lazy database connection.
 *
 * The connection pool is only created on first use, so importing this module
 * never crashes builds, route metadata collection, or knowledge-base features
 * that work standalone. When DATABASE_URL is missing, the first actual query
 * throws a clear error (fail fast at request time, not at import time).
 */

const globalForDb = globalThis as typeof globalThis & {
  __promptForgePool?: Pool;
  __promptForgeDb?: NodePgDatabase;
};

function createPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required for database-backed features (see .env.example).",
    );
  }
  const pool =
    globalForDb.__promptForgePool ?? new Pool({ connectionString: databaseUrl });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__promptForgePool = pool;
  }
  return pool;
}

function getDb(): NodePgDatabase {
  if (!globalForDb.__promptForgeDb) {
    globalForDb.__promptForgeDb = drizzle(createPool());
  }
  return globalForDb.__promptForgeDb;
}

/** True when a database connection string is configured. */
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

/**
 * Drizzle client. The proxy defers pool creation until the first method call,
 * so importing this module stays side-effect free for builds and tests.
 */
export const db = new Proxy({} as NodePgDatabase, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
