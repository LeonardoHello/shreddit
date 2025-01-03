import db from "../db";
import { communities } from "../db/schema";

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
  .prepare("moderated_communities");

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
  .prepare("favorite_communities");

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
  .prepare("joined_communities");

export const getMyCommunities = db.query.usersToCommunities
  .findMany({
    where: (userToCommunity, { sql, and, eq }) =>
      and(
        eq(userToCommunity.userId, sql.placeholder("currentUserId")),
        eq(userToCommunity.member, true),
      ),
    columns: {},
    with: {
      community: {
        columns: { id: true, name: true, imageUrl: true },
        with: {
          usersToCommunities: {
            columns: { userId: true },
            where: (userToCommunity, { eq }) =>
              eq(userToCommunity.member, true),
          },
        },
      },
    },
  })
  .prepare("selectable_communities");
