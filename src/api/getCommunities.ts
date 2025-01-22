import { communities } from "@/db/schema";
import db from "../db";

export const getModeratedCommunities = db.query.usersToCommunities
  .findMany({
    where: (userToCommunity, { sql, and, eq, exists }) =>
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
    columns: { favorited: true },
    with: { community: { columns: { id: true, name: true, icon: true } } },
  })
  .prepare("moderated_communities");

export const getJoinedCommunities = db.query.usersToCommunities
  .findMany({
    where: (userToCommunity, { sql, and, eq }) =>
      and(
        eq(userToCommunity.userId, sql.placeholder("currentUserId")),
        eq(userToCommunity.joined, true),
      ),
    columns: { favorited: true },
    with: { community: { columns: { id: true, name: true, icon: true } } },
  })
  .prepare("joined_communities");

export const getMyCommunities = db.query.usersToCommunities
  .findMany({
    where: (userToCommunity, { sql, and, eq }) =>
      and(
        eq(userToCommunity.userId, sql.placeholder("currentUserId")),
        eq(userToCommunity.joined, true),
      ),
    columns: {},
    with: {
      community: {
        columns: { id: true, name: true, icon: true },
        with: {
          usersToCommunities: {
            columns: { userId: true },
            where: (userToCommunity, { eq }) =>
              eq(userToCommunity.joined, true),
          },
        },
      },
    },
  })
  .prepare("selectable_communities");
