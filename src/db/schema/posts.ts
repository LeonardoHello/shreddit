import { relations, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-valibot";

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
    voteCount: integer().notNull().default(0),
    commentCount: integer().notNull().default(0),
    authorId: text()
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    communityId: uuid()
      .references(() => communities.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [
    index("vote_count_index").on(t.voteCount.desc()),
    index("vote_count_and_id_index").on(t.voteCount.desc(), t.id.desc()),
    index("comment_count_index").on(t.commentCount.desc()),
    index("comment_count_and_id_index").on(t.commentCount.desc(), t.id.desc()),
    index("created_at_index").on(t.createdAt.desc()),
    index("created_at_and_id_index").on(t.createdAt.desc(), t.id.desc()),

    // 4. For PostFeed.USER and PostFeed.COMMUNITY filters
    index("posts_author_id_idx").on(t.authorId),
    index("posts_community_id_idx").on(t.communityId),
  ],
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
    // For the 'hideHidden' filter (Critical for Feed performance)
    index("utp_user_hidden_idx").on(t.userId, t.postId, t.hidden),
    // For 'Upvoted' and 'Saved' profile feeds
    index("utp_user_vote_idx").on(t.userId, t.postId, t.voteStatus),
    index("utp_user_saved_idx").on(t.userId, t.postId, t.saved),
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
