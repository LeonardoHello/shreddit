import { relations, sql } from "drizzle-orm";
import {
  text,
  pgTable,
  uuid,
  integer,
  varchar,
  timestamp,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 256 }).primaryKey(), // clerk user id
  username: varchar("username", { length: 256 }).notNull(),
  onions: integer("onions").default(0),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToCommunities: many(usersToCommunities),
  posts: many(posts),
  comments: many(comments),
}));

export const communities = pgTable("communities", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  about: text("about"),
  nsfw: boolean("nsfw").default(false),
  authorId: varchar("author_id", { length: 256 })
    .references(() => users.id)
    .notNull(),
});

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  author: one(users, {
    fields: [communities.authorId],
    references: [users.id],
  }),
  usersToCommunities: many(usersToCommunities),
  posts: many(posts),
}));

export const usersToCommunities = pgTable(
  "users_to_communities",
  {
    authorId: varchar("author_id")
      .notNull()
      .references(() => users.id),
    communityId: uuid("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),
    muted: boolean("muted").default(false),
  },
  (t) => ({
    pk: primaryKey(t.authorId, t.communityId),
  }),
);

export const usersToCommunitiesRelations = relations(
  usersToCommunities,
  ({ one }) => ({
    author: one(users, {
      fields: [usersToCommunities.authorId],
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  title: varchar("title", { length: 256 }).notNull(),
  text: text("text"),
  media: varchar("media", { length: 256 }),
  link: varchar("link", { length: 256 }),
  nsfw: boolean("nsfw").notNull(),
  spoiler: boolean("spoiler").notNull(),
  upvoted: varchar("upvoted", { length: 256 })
    .array()
    .default(sql`ARRAY[]::varchar[]`),
  authorId: varchar("author_id", { length: 256 })
    .references(() => users.id)
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
  comments: many(comments),
}));

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  text: text("text").notNull(),
  upvoted: varchar("upvoted", { length: 256 })
    .array()
    .default(sql`ARRAY[]::varchar[]`),
  authorId: varchar("author_id", { length: 256 })
    .references(() => users.id)
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
}));
