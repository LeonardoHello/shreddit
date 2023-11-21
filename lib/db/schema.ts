import { InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

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
  usersToCommunities: many(usersToCommunities),
  posts: many(posts),
  comments: many(comments),
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
  },
  (t) => ({
    nameIdx: uniqueIndex("name_idx").on(t.name),
  }),
);

export const communitiesRelations = relations(communities, ({ many }) => ({
  usersToCommunities: many(usersToCommunities),
  posts: many(posts),
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
    author: boolean("author").notNull().default(false),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.communityId),
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
  upvoted: text("upvoted").array(),
  downvoted: text("downvoted").array(),
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
  upvoted: text("upvoted").array(),
  downvoted: text("downvoted").array(),
  replyId: uuid("reply_id"),
  authorId: text("author_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  postId: uuid("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  reply: one(comments, {
    fields: [comments.replyId],
    references: [comments.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type Community = InferSelectModel<typeof communities>;
export type UserToCommunity = InferSelectModel<typeof usersToCommunities>;
export type Post = InferSelectModel<typeof posts>;
export type File = InferSelectModel<typeof files>;
export type Comment = InferSelectModel<typeof comments>;

export const UserSchema = createSelectSchema(users);
export const CommunitySchema = createSelectSchema(communities);
export const UserToCommunitySchema = createSelectSchema(usersToCommunities);
export const PostSchema = createSelectSchema(posts);
export const FileSchema = createSelectSchema(files);
export const CommentSchema = createSelectSchema(comments);
