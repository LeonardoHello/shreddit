import { relations, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

import { timestamps, uploadthingFile } from "../helpers";
import { comments } from "./comments";
import { communities } from "./communities";
import { voteStatusEnum } from "./enums";
import { users } from "./users";

export const posts = pgTable(
  "posts",
  {
    id: uuid().primaryKey().defaultRandom(),
    ...timestamps,
    title: text().notNull(),
    text: text(),
    nsfw: boolean().notNull().default(false),
    spoiler: boolean().notNull().default(false),
    authorId: text()
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    communityId: uuid()
      .references(() => communities.id, { onDelete: "cascade" })
      .notNull(),
  },

  (t) => [uniqueIndex().on(t.id)],
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  community: one(communities, {
    fields: [posts.communityId],
    references: [communities.id],
  }),
  files: many(postFiles),
  comments: many(comments),
  usersToPosts: many(usersToPosts),
}));

export const usersToPosts = pgTable(
  "users_to_posts",
  {
    userId: text()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    postId: uuid()
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps,
    voteStatus: voteStatusEnum().notNull().default("none"),
    saved: boolean().notNull().default(false),
    hidden: boolean().notNull().default(false),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.postId] }),
    index().on(t.userId),
    index().on(t.postId),
  ],
);

export const usersToPostsRelations = relations(usersToPosts, ({ one }) => ({
  user: one(users, {
    fields: [usersToPosts.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [usersToPosts.postId],
    references: [posts.id],
  }),
}));

export const postFiles = pgTable("post_files", {
  id: uuid().primaryKey().defaultRandom(),
  ...timestamps,
  ...uploadthingFile,
  thumbHash: text().notNull(),
  postId: uuid()
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
});

export const postFilesRelations = relations(postFiles, ({ one }) => ({
  post: one(posts, {
    fields: [postFiles.postId],
    references: [posts.id],
  }),
}));

export type Post = InferSelectModel<typeof posts>;
export type UserToPost = InferSelectModel<typeof usersToPosts>;
export type PostFile = InferSelectModel<typeof postFiles>;
export const PostSchema = createSelectSchema(posts);
export const UserToPostSchema = createSelectSchema(usersToPosts);
export const PostFileSchema = createSelectSchema(postFiles);
