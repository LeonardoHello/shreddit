import { text, pgTable, uuid, date, integer } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: date("created_at").defaultNow(),
  upvotes: integer("upvotes").default(0),
});
