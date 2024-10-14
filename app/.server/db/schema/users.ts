import { sql } from "drizzle-orm";
import {
  index,
  serial,
  timestamp,
  varchar,
  pgTable,
} from "drizzle-orm/pg-core";

/**
 * All tables shall be in the PLURAL form.
 * Due to confusion between reference terminology `posted_by` and `user_id`,
 * all table references shall be in `xxx_by`.
 */

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 64 }).unique().notNull(),
    password: varchar("password", { length: 64 }).notNull(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (users) => ({
    nameIndex: index("users_username_idx").on(users.username),
  })
);

export type User = typeof users.$inferSelect;
