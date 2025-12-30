import { relations, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-valibot";

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
  iconPlaceholder: text(),
  banner: text(),
  bannerPlaceholder: text(),
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
    favoritedAt: timestamp({ mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
    joined: boolean().notNull().default(true),
    joinedAt: timestamp({ mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.communityId] }),
    // Index for checking if a user has joined a specific community
    index("utc_user_joined_idx").on(t.userId, t.communityId, t.joined),

    // Index for filtering out muted communities
    index("utc_user_muted_idx").on(t.userId, t.communityId, t.muted),
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

export type Community = InferSelectModel<typeof communities>;
export type UserToCommunity = InferSelectModel<typeof usersToCommunities>;

export const CommunitySchema = createSelectSchema(communities);
export const UserToCommunitySchema = createSelectSchema(usersToCommunities);
