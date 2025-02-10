import { text, timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const uploadthingFile = {
  name: text().notNull(),
  key: text().unique().notNull(),
  url: text().unique().notNull(),
};
