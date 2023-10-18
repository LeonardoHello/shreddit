import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default {
  schema: "./lib/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL as string,
  },
} satisfies Config;
