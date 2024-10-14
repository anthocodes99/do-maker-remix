import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";

import { schema } from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn =
  globalForDb.conn ?? postgres(z.string().parse(process.env.DATABASE_URL));
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export function db() {
  return drizzle(conn, { schema, logger: true });
}
