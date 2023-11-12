import { and, eq, ilike, sql } from "drizzle-orm";

import db from "@/db";
import { communities, users, usersToCommunities } from "@/db/schema";

export const getFavoriteCommunities = (userId: string) => {
  return db.query.usersToCommunities.findMany({
    where: and(
      eq(usersToCommunities.userId, userId),
      eq(usersToCommunities.favorite, true),
    ),
    columns: { userId: true, communityId: true, favorite: true },
    with: { community: { columns: { name: true, imageUrl: true } } },
  });
};

export const getOwnedCommunities = (userId: string) => {
  return db.query.usersToCommunities.findMany({
    where: and(
      eq(usersToCommunities.userId, userId),
      eq(usersToCommunities.author, true),
    ),
    columns: { userId: true, communityId: true, favorite: true },
    with: { community: { columns: { name: true, imageUrl: true } } },
  });
};

export const getJoinedCommunities = (userId: string) => {
  return db.query.usersToCommunities.findMany({
    where: and(
      eq(usersToCommunities.userId, userId),
      eq(usersToCommunities.member, true),
    ),
    columns: { userId: true, communityId: true, favorite: true },
    with: { community: { columns: { name: true, imageUrl: true } } },
  });
};

export const getUserImageUrl = db.query.users
  .findFirst({
    where: eq(users.name, sql.placeholder("name")),
    columns: { imageUrl: true },
  })
  .prepare("getUserImageUrl");

export const getCommunityImageUrl = db.query.communities
  .findFirst({
    where: eq(communities.name, sql.placeholder("name")),
    columns: { imageUrl: true },
  })
  .prepare("getCommunityImageUrl");

export const getSearchedUsers = db.query.users
  .findMany({
    where: ilike(users.name, sql.placeholder("search")),
    columns: { id: false },
    limit: 4,
  })
  .prepare("getSearchedUsers");

export const getSearchedCommunities = db.query.communities
  .findMany({
    where: ilike(communities.name, sql.placeholder("search")),
    columns: { name: true, imageUrl: true, nsfw: true },
    limit: 4,
    with: {
      usersToCommunities: {
        where: eq(usersToCommunities.member, true),
        columns: { communityId: true },
      },
    },
  })
  .prepare("getSearchedCommunities");

export const toggleFavorite = (
  userId: string,
  communityId: string,
  favorite: boolean,
) => {
  return db
    .update(usersToCommunities)
    .set({ favorite })
    .where(
      and(
        eq(usersToCommunities.userId, userId),
        eq(usersToCommunities.communityId, communityId),
      ),
    );
};
