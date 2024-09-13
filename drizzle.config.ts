import { defineConfig } from "drizzle-kit";
import { z } from "zod";

// You can configure Drizzle's settings here.
// This project defaults to filtering tables under `r3-antho-app_`.
// https://orm.drizzle.team/kit-docs/conf
export default defineConfig({
  schema: "./app/.server/db/schema/*",
  out: "./app/.server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: z.string().parse(process.env.DATABASE_URL),
  },
  tablesFilter: ['r3-antho-app_']
});
