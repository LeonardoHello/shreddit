import { relations, type InferSelectModel } from "drizzle-orm";
import {
  index,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

import { timestamps } from "../helpers";
import { voteStatusEnum } from "./enums";
import { posts } from "./posts";
import { users } from "./users";

export const comments = pgTable(
  "comments",
  {
    id: uuid().primaryKey().defaultRandom(),
    text: text().notNull(),
    parentCommentId: uuid().references((): AnyPgColumn => comments.id, {
      onDelete: "cascade",
    }),
    authorId: text()
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    postId: uuid()
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex().on(t.id)],
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
  }),
  usersToComments: many(usersToComments),
}));

export const usersToComments = pgTable(
  "users_to_comments",
  {
    userId: text()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    commentId: uuid()
      .references(() => comments.id, { onDelete: "cascade" })
      .notNull(),
    voteStatus: voteStatusEnum().notNull().default("none"),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.commentId] }),
    index().on(t.userId),
    index().on(t.commentId),
  ],
);

export const usersToCommentsRelations = relations(
  usersToComments,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToComments.userId],
      references: [users.id],
    }),
    comment: one(comments, {
      fields: [usersToComments.commentId],
      references: [comments.id],
    }),
  }),
);

export type Comment = InferSelectModel<typeof comments>;
export type UserToComment = InferSelectModel<typeof usersToComments>;

export const CommentSchema = createSelectSchema(comments);
export const UserToCommentSchema = createSelectSchema(usersToComments);
