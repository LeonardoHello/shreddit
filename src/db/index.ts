import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL as string);
const db = drizzle(sql, { schema });

export default db;
