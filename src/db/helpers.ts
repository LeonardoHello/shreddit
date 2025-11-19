import { sql } from "drizzle-orm";
import { text, timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp({ mode: "string" })
    .default(sql`NOW()`)
    .notNull(),
  updatedAt: timestamp({ mode: "string" })
    .default(sql`NOW()`)
    .$onUpdate(() => sql`NOW()`)
    .notNull(),
};

export const uploadthingFile = {
  name: text().notNull(),
  key: text().unique().notNull(),
  url: text().unique().notNull(),
};
