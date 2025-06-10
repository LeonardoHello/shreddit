import { text, timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp()
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp()
    .$defaultFn(() => new Date())
    .notNull()
    .$onUpdate(() => new Date()),
};

export const uploadthingFile = {
  name: text().notNull(),
  key: text().unique().notNull(),
  url: text().unique().notNull(),
};
