import { sql } from "drizzle-orm";
import {
  serial,
  timestamp,
  varchar,
  pgTable,
  integer,
  boolean,
  date,
  decimal,
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { companies } from "./companies";

/**
 * All tables shall be in the PLURAL form.
 * Due to confusion between reference terminology `posted_by` and `user_id`,
 * all table references shall be in `xxx_by`.
 */

export const deliveryOrders = pgTable("delivery_orders", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  companyId: integer("company_id")
    .references(() => companies.id)
    .notNull(),
  isPosted: boolean("is_posted").default(false),
  postedAt: timestamp("posted_at"),
  postedBy: integer("posted_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
});

// NOTE: update `$doId_.edit`'s `action()` function whenever changes are
//       made here for edit to work
export const deliveryOrderItems = pgTable("delivery_order_items", {
  id: serial("id").primaryKey(),
  deliveryOrderId: integer("delivery_order_id")
    .references(() => deliveryOrders.id)
    .notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  quantity: decimal("quantity").notNull(),
  uom: varchar("uom").notNull(), //unit of measurement
  // delivery order does not need unit price
  // unitPrice: decimal("unitPrice").notNull(),
  description: varchar("description", { length: 128 }),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  createdBy: integer("created_by").references(() => users.id),
});

export const deliveryOrderHeaders = pgTable("delivery_order_headers", {
  id: serial("id").primaryKey(),
  deliveryOrderId: integer("delivery_order_id")
    .references(() => deliveryOrders.id)
    .notNull(),
  header: varchar("header", { length: 32 }).notNull(),
  value: varchar("value", { length: 32 }).notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  createdBy: integer("created_by").references(() => users.id),
});

export type DeliveryOrder = typeof deliveryOrders.$inferSelect;

export type DeliveryOrderHeader = typeof deliveryOrderHeaders.$inferSelect;

export type DeliveryOrderItem = typeof deliveryOrderItems.$inferSelect;
