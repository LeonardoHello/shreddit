import { communities, usersToCommunities } from "@/db/schema/communities";
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

export const getMutedCommunities = db.query.usersToCommunities
  .findMany({
    where: (userToCommunity, { sql, and, eq }) =>
      and(
        eq(userToCommunity.userId, sql.placeholder("currentUserId")),
        eq(userToCommunity.muted, true),
      ),
    columns: { favorited: true },
    with: { community: { columns: { id: true, name: true, icon: true } } },
  })
  .prepare("muted_communities");

export const getMyCommunities = db.query.communities
  .findMany({
    where: (community, { sql, and, eq, exists }) =>
      exists(
        db
          .select()
          .from(usersToCommunities)
          .where(
            and(
              eq(usersToCommunities.communityId, community.id),
              eq(usersToCommunities.userId, sql.placeholder("currentUserId")),
              eq(usersToCommunities.joined, true),
            ),
          ),
      ),
    columns: { id: true, name: true, icon: true },
    extras: (community, { sql }) => ({
      memberCount: sql<number>`
        (
          SELECT COUNT(*) 
          FROM users_to_communities 
          WHERE users_to_communities.community_id = ${community.id} 
            AND users_to_communities.joined = true
        )
      `.as("member_count"),
    }),
  })
  .prepare("selectable_communities");
