import { and, eq } from "drizzle-orm";

import db from "../db";
import { usersToCommunities } from "../db/schema";

export const getJoinedCommunitiesIds = (userId: string) => {
  return db.query.usersToCommunities.findMany({
    columns: { communityId: true },
    where: and(
      eq(usersToCommunities.userId, userId),
      eq(usersToCommunities.member, true),
    ),
  });
};

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
