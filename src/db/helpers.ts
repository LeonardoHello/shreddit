import { text, timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp({ mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ mode: "string", withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
};

export const uploadthingFile = {
  name: text().notNull(),
  key: text().unique().notNull(),
  url: text().unique().notNull(),
};
