import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 256 }).primaryKey(), // clerk user id
    name: varchar("name", { length: 256 }).unique().notNull(),
    imageUrl: varchar("image_url", { length: 256 }).notNull(),
    onions: integer("onions").default(0).notNull(),
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    name: varchar("name", { length: 256 }).unique().notNull(),
    imageUrl: varchar("image_url", { length: 256 }),
    about: text("about"),
    nsfw: boolean("nsfw").default(false).notNull(),
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
    userId: varchar("user_id", { length: 256 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    communityId: uuid("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),
    muted: boolean("muted").default(false).notNull(),
    favorite: boolean("favorite").default(false).notNull(),
    member: boolean("member").default(true).notNull(),
    author: boolean("author").default(false).notNull(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  title: varchar("title", { length: 256 }).notNull(),
  text: text("text"),
  media: varchar("media", { length: 256 }),
  link: varchar("link", { length: 256 }),
  nsfw: boolean("nsfw").notNull(),
  spoiler: boolean("spoiler").notNull(),
  upvoted: varchar("upvoted", { length: 256 }).array(),
  downvoted: varchar("downvoted", { length: 256 }).array(),
  authorId: varchar("author_id", { length: 256 }).references(() => users.id, {
    onDelete: "set null",
  }),
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
  comments: many(comments),
}));

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  text: text("text").notNull(),
  upvoted: varchar("upvoted", { length: 256 }).array(),
  downvoted: varchar("downvoted", { length: 256 }).array(),
  authorId: varchar("author_id", { length: 256 }).references(() => users.id, {
    onDelete: "set null",
  }),
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
}));

export type User = typeof users.$inferSelect;
export type Community = typeof communities.$inferSelect;
export type UserToCommunity = typeof usersToCommunities.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;

export const UserSchema = createSelectSchema(users);
export const CommunitySchema = createSelectSchema(communities);
export const UserToCommunitySchema = createSelectSchema(usersToCommunities);
export const PostSchema = createSelectSchema(posts);
export const CommentSchema = createSelectSchema(comments);
