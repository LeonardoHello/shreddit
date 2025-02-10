import { relations, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

import { timestamps } from "../helpers";
import { comments, usersToComments } from "./comments";
import { communities, usersToCommunities } from "./communities";
import { posts, usersToPosts } from "./posts";

export const users = pgTable(
  "users",
  {
    id: text().primaryKey(), // clerk user id
    ...timestamps,
    username: text().unique().notNull(),
    firstName: text(),
    lastName: text(),
    imageUrl: text().notNull(),
  },
  (t) => [uniqueIndex().on(t.id), uniqueIndex().on(t.username)],
);

export const usersRelations = relations(users, ({ many }) => ({
  communities: many(communities),
  usersToCommunities: many(usersToCommunities),
  posts: many(posts),
  usersToPosts: many(usersToPosts),
  comments: many(comments),
  usersToComments: many(usersToComments),
}));

export type User = InferSelectModel<typeof users>;
export const UserSchema = createSelectSchema(users);
