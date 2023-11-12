import { and, desc, eq, ilike, inArray, sql } from "drizzle-orm";

import db from "@/db";
import { communities, posts, users, usersToCommunities } from "@/db/schema";

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

export const getJoinedCommunitiesIds = (userId: string) => {
  return db.query.usersToCommunities.findMany({
    columns: { communityId: true },
    where: and(
      eq(usersToCommunities.userId, userId),
      eq(usersToCommunities.member, true),
    ),
  });
};

export const getJoinedCommunitiesPosts = (communityIds: string[]) => {
  return db.query.posts
    .findMany({
      limit: 10,
      where: inArray(posts.communityId, communityIds),
      offset: sql.placeholder("offset"),
      with: {
        community: { columns: { name: true, imageUrl: true } },
        comments: {},
      },
      orderBy: [desc(posts.createdAt)],
    })
    .prepare("getJoinedCommunitiesPosts");
};

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
