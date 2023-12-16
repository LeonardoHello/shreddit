import { type InferSelectModel, relations } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

export const voteStatusEnum = pgEnum("vote_status", [
  "upvoted",
  "downvoted",
  "none",
]);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // clerk user id
    name: text("name").unique().notNull(),
    imageUrl: text("image_url").notNull(),
  },
  (t) => ({
    nameIdx: uniqueIndex("name_idx").on(t.name),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  communities: many(communities),
  usersToCommunities: many(usersToCommunities),
  posts: many(posts),
  usersToPosts: many(usersToPosts),
  comments: many(comments),
  usersToComments: many(usersToComments),
}));

export const communities = pgTable(
  "communities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    name: text("name").unique().notNull(),
    imageUrl: text("image_url"),
    about: text("about"),
    nsfw: boolean("nsfw").notNull().default(false),
    moderatorId: text("moderator_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (t) => ({
    nameIdx: uniqueIndex("name_idx").on(t.name),
  }),
);

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  moderator: one(users, {
    fields: [communities.moderatorId],
    references: [users.id],
  }),
  posts: many(posts),
  usersToCommunities: many(usersToCommunities),
}));

export const usersToCommunities = pgTable(
  "users_to_communities",
  {
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    communityId: uuid("community_id")
      .references(() => communities.id, { onDelete: "cascade" })
      .notNull(),
    muted: boolean("muted").notNull().default(false),
    favorite: boolean("favorite").notNull().default(false),
    member: boolean("member").notNull().default(true),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.communityId] }),
    userIdIdx: index("user_id_idx").on(t.userId),
  }),
);

export const usersToCommunitiesRelations = relations(
  usersToCommunities,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToCommunities.userId],
      references: [users.id],
    }),
    community: one(communities, {
      fields: [usersToCommunities.communityId],
      references: [communities.id],
    }),
  }),
);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  title: text("title").notNull(),
  text: text("text"),
  nsfw: boolean("nsfw").notNull().default(false),
  spoiler: boolean("spoiler").notNull().default(false),
  authorId: text("author_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  communityId: uuid("community_id")
    .references(() => communities.id, { onDelete: "cascade" })
    .notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  community: one(communities, {
    fields: [posts.communityId],
    references: [communities.id],
  }),
  files: many(files),
  comments: many(comments),
  usersToPosts: many(usersToPosts),
}));

export const usersToPosts = pgTable(
  "users_to_posts",
  {
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    postId: uuid("post_id")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    voteStatus: voteStatusEnum("vote_status").notNull().default("none"),
    saved: boolean("saved").notNull().default(false),
    hidden: boolean("hidden").notNull().default(false),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.postId] }),
    userIdIdx: index("user_id_idx").on(t.userId),
    postIdIdx: index("post_id_idx").on(t.postId),
  }),
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

export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  key: text("key").notNull(),
  url: text("url").notNull(),
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
});

export const filesRelations = relations(files, ({ one }) => ({
  post: one(posts, {
    fields: [files.postId],
    references: [posts.id],
  }),
}));

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  text: text("text").notNull(),
  parentCommentId: uuid("parent_comment_id").references(
    (): AnyPgColumn => comments.id,
    {
      onDelete: "cascade",
    },
  ),
  authorId: text("author_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
});

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
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    commentId: uuid("comment_id")
      .references(() => comments.id, { onDelete: "cascade" })
      .notNull(),
    voteStatus: voteStatusEnum("vote_status").notNull().default("none"),
    saved: boolean("saved").notNull().default(false),
    hidden: boolean("hidden").notNull().default(false),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.commentId] }),
    userIdIdx: index("user_id_idx").on(t.userId),
    commentIdIdx: index("comment_id_idx").on(t.commentId),
  }),
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

export type User = InferSelectModel<typeof users>;
export type Community = InferSelectModel<typeof communities>;
export type UserToCommunity = InferSelectModel<typeof usersToCommunities>;
export type Post = InferSelectModel<typeof posts>;
export type UserToPost = InferSelectModel<typeof usersToPosts>;
export type File = InferSelectModel<typeof files>;
export type Comment = InferSelectModel<typeof comments>;
export type UserToComments = InferSelectModel<typeof usersToComments>;

export const UserSchema = createSelectSchema(users);
export const CommunitySchema = createSelectSchema(communities);
export const UserToCommunitySchema = createSelectSchema(usersToCommunities);
export const PostSchema = createSelectSchema(posts);
export const UserToPostSchema = createSelectSchema(usersToPosts);
export const FileSchema = createSelectSchema(files);
export const CommentSchema = createSelectSchema(comments);
export const UserToCommentSchema = createSelectSchema(usersToComments);
