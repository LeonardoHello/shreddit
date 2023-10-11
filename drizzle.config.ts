import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL as string,
    // database: process.env.PG_DATABASE as string,
    // host: process.env.PG_HOST as string,
    // password: process.env.PG_PASSWORD,
    // user: process.env.PG_USER,
    // ssl: true,
  },
} satisfies Config;
