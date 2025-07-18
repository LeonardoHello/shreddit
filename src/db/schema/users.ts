import { relations, type InferSelectModel } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

import { comments, usersToComments } from "./comments";
import { communities, usersToCommunities } from "./communities";
import { posts, usersToPosts } from "./posts";

export const users = pgTable("users", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean()
    .$defaultFn(() => false)
    .notNull(),
  image: text(),
  createdAt: timestamp()
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp()
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text().unique(),
  displayUsername: text(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text().primaryKey(),
    expiresAt: timestamp().notNull(),
    token: text().notNull().unique(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [index().on(t.userId)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    password: text(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  (t) => [index().on(t.userId)],
);

export const verifications = pgTable(
  "verifications",
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp().notNull(),
    createdAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()),
    updatedAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()),
  },
  (t) => [index().on(t.identifier)],
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
export type Session = InferSelectModel<typeof sessions>;
export type Account = InferSelectModel<typeof accounts>;
export type Verification = InferSelectModel<typeof verifications>;

export const UserSchema = createSelectSchema(users);
export const SessionSchema = createSelectSchema(sessions);
export const AccountSchema = createSelectSchema(accounts);
export const VerificationSchema = createSelectSchema(verifications);
