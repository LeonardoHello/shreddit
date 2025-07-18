import { relations, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

import { timestamps } from "../helpers";
import { posts } from "./posts";
import { users } from "./users";

export const communities = pgTable("communities", {
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
});

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
  (t) => [primaryKey({ columns: [t.userId, t.communityId] })],
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

export type Community = InferSelectModel<typeof communities>;
export type UserToCommunity = InferSelectModel<typeof usersToCommunities>;

export const CommunitySchema = createSelectSchema(communities);
export const UserToCommunitySchema = createSelectSchema(usersToCommunities);
