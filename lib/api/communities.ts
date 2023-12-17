import { and, eq } from "drizzle-orm";

import db from "../db";
import { type UserToCommunity, communities } from "../db/schema";

export const getModeratedCommunities = (userId: UserToCommunity["userId"]) => {
  return db.query.usersToCommunities.findMany({
    where: (userToCommunity, { exists }) =>
      exists(
        db
          .select()
          .from(communities)
          .where(
            and(
              eq(communities.moderatorId, userId),
              eq(communities.moderatorId, userToCommunity.userId),
              eq(communities.id, userToCommunity.communityId),
            ),
          ),
      ),
    columns: { userId: true, communityId: true, favorite: true },
    with: { community: { columns: { name: true, imageUrl: true } } },
  });
};

export const getFavoriteCommunities = (userId: UserToCommunity["userId"]) => {
  return db.query.usersToCommunities.findMany({
    where: (userToCommunity, { and, eq }) =>
      and(
        eq(userToCommunity.userId, userId),
        eq(userToCommunity.favorite, true),
      ),
    columns: { userId: true, communityId: true, favorite: true },
    with: { community: { columns: { name: true, imageUrl: true } } },
  });
};

export const getJoinedCommunities = (userId: UserToCommunity["userId"]) => {
  return db.query.usersToCommunities.findMany({
    where: (userToCommunity, { and, eq }) =>
      and(eq(userToCommunity.userId, userId), eq(userToCommunity.member, true)),
    columns: { userId: true, communityId: true, favorite: true },
    with: { community: { columns: { name: true, imageUrl: true } } },
  });
};
