import { sql } from "drizzle-orm";
import { snakeCase } from "scule";

// https://github.com/drizzle-team/drizzle-orm/issues/1728
// adapted to PostgreSQL and added scule because of poor planning
export function setAllValues(values: Record<string, unknown>[]) {
  return Object.assign(
    {},
    ...Object.keys(values[0]!).map((k) => {
      // db columns are in snake case, so i brought in
      // scule to help convert camelCase to snake_case
      return { [k]: sql.raw(`excluded.${snakeCase(k)}`) }; //Needs to be raw because otherwise it will have 3 string chunks!
    })
  ) as Record<string, unknown>;
}
