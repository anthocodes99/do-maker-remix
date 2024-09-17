import { sql } from "drizzle-orm";
import {
  index,
  serial,
  timestamp,
  varchar,
  pgTable,
  integer,
} from "drizzle-orm/pg-core";

import { users } from "./users";

/**
 * All tables shall be in the PLURAL form.
 * Due to confusion between reference terminology `posted_by` and `user_id`,
 * all table references shall be in `xxx_by`.
 */

export const companies = pgTable(
  "companies",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 64 }).unique().notNull(),
    fullName: varchar("full_name", { length: 256 }).unique().notNull(),
    addressLineOne: varchar("address_line_one", { length: 64 }),
    addressLineTwo: varchar("address_line_two", { length: 64 }),
    telephoneNumber: varchar("telephone_number", { length: 32 }),
    taxCode: varchar("tax_code", { length: 32 }),
    taxNumber: varchar("tax_number", { length: 32 }),
    contactPerson: varchar("contact_person", { length: 32 }),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    createdby: integer("created_by").references(() => users.id),
  },
  (company) => ({
    nameIndex: index("companies_name_idx").on(company.name),
  })
);
