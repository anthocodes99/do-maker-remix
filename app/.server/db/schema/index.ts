import * as companies from "./companies";
import * as deliveryOrders from "./delivery-orders";
import * as users from "./users";

// Read more about SQL declaration here
// https://orm.drizzle.team/docs/sql-schema-declaration

// Import your schema here.
export const schema = {
  ...deliveryOrders,
  ...users,
  ...companies,
};
