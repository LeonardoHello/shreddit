import { relations, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const voteStatusEnum = pgEnum("vote_status", [
  "upvoted",
  "downvoted",
  "none",
]);

export const users = pgTable(
  "users",
  {
    id: text().primaryKey(), // clerk user id
    username: text().unique().notNull(),
    firstName: text(),
    lastName: text(),
    imageUrl: text().notNull(),
    ...timestamps,
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

export const communities = pgTable(
  "communities",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().unique().notNull(),
    displayName: text().notNull().default(""),
    description: text().notNull().default(""),
    memberNickname: text().notNull().default(""),
    icon: text(),
    banner: text(),
    moderatorId: text()
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex().on(t.id), uniqueIndex().on(t.name)],
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
    userId: text()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    communityId: uuid()
      .references(() => communities.id, { onDelete: "cascade" })
      .notNull(),
    muted: boolean().notNull().default(false),
    favorited: boolean().notNull().default(false),
    joined: boolean().notNull().default(true),
    joinedAt: timestamp().notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.communityId] }),
    index().on(t.userId),
  ],
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

export const posts = pgTable(
  "posts",
  {
    id: uuid().primaryKey().defaultRandom(),
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
    ...timestamps,
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
    voteStatus: voteStatusEnum().notNull().default("none"),
    saved: boolean().notNull().default(false),
    hidden: boolean().notNull().default(false),
    ...timestamps,
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
  name: text().notNull(),
  key: text().unique().notNull(),
  url: text().unique().notNull(),
  thumbHash: text().notNull(),
  postId: uuid()
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  ...timestamps,
});

export const filesRelations = relations(postFiles, ({ one }) => ({
  post: one(posts, {
    fields: [postFiles.postId],
    references: [posts.id],
  }),
}));

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

export type User = InferSelectModel<typeof users>;
export type Community = InferSelectModel<typeof communities>;
export type UserToCommunity = InferSelectModel<typeof usersToCommunities>;
export type Post = InferSelectModel<typeof posts>;
export type UserToPost = InferSelectModel<typeof usersToPosts>;
export type PostFile = InferSelectModel<typeof postFiles>;
export type Comment = InferSelectModel<typeof comments>;
export type UserToComment = InferSelectModel<typeof usersToComments>;

export const UserSchema = createSelectSchema(users);
export const CommunitySchema = createSelectSchema(communities);
export const UserToCommunitySchema = createSelectSchema(usersToCommunities);
export const PostSchema = createSelectSchema(posts);
export const UserToPostSchema = createSelectSchema(usersToPosts);
export const PostFileSchema = createSelectSchema(postFiles);
export const CommentSchema = createSelectSchema(comments);
export const UserToCommentSchema = createSelectSchema(usersToComments);
