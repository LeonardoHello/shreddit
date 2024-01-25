import db from "../db";
import { type UserToCommunity, communities } from "../db/schema";

export const getModeratedCommunities = db.query.usersToCommunities
  .findMany({
    where: (userToCommunity, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(communities)
          .where(
            and(
              eq(communities.moderatorId, sql.placeholder("currentUserId")),
              eq(communities.moderatorId, userToCommunity.userId),
              eq(communities.id, userToCommunity.communityId),
            ),
          ),
      ),
    columns: { userId: true, communityId: true, favorite: true },
    with: { community: { columns: { id: true, name: true, imageUrl: true } } },
  })
  .prepare("get_moderated_communities");

export const getFavoriteCommunities = db.query.usersToCommunities
  .findMany({
    where: (userToCommunity, { sql, and, eq }) =>
      and(
        eq(userToCommunity.userId, sql.placeholder("currentUserId")),
        eq(userToCommunity.favorite, true),
      ),
    columns: { userId: true, communityId: true, favorite: true },
    with: { community: { columns: { id: true, name: true, imageUrl: true } } },
  })
  .prepare("get_favorite_communities");

export const getJoinedCommunities = db.query.usersToCommunities
  .findMany({
    where: (userToCommunity, { sql, and, eq }) =>
      and(
        eq(userToCommunity.userId, sql.placeholder("currentUserId")),
        eq(userToCommunity.member, true),
      ),
    columns: { userId: true, communityId: true, favorite: true },
    with: { community: { columns: { id: true, name: true, imageUrl: true } } },
  })
  .prepare("get_joined_communities");
