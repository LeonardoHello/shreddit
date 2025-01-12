import { communities } from "@/db/schema";
import { monthAgo } from "@/utils/getLastMonthDate";
import db from "../db";

export const getCommunityByName = db.query.communities
  .findFirst({
    where: (community, { sql, eq }) =>
      eq(community.name, sql.placeholder("communityName")),
    extras: (community, { sql }) => ({
      memberCount: sql<number>`
        (
          SELECT COUNT(*) 
          FROM users_to_communities 
          WHERE users_to_communities.community_id = ${community.id} 
            AND users_to_communities.joined = true
        )
      `.as("member_count"),
      newMemberCount: sql<number>`
        (
          SELECT COUNT(*) 
          FROM users_to_communities 
          WHERE users_to_communities.community_id = ${community.id} 
            AND users_to_communities.joined = true 
            AND users_to_communities.joined_at > ${monthAgo}
        )
      `.as("new_member_count"),
    }),
  })
  .prepare("community_by_name");

export const getSelectedCommunity = db.query.communities
  .findFirst({
    where: (community, { sql, eq }) =>
      eq(community.name, sql.placeholder("communityName")),
    columns: { id: true, name: true, icon: true },
    with: {
      usersToCommunities: {
        columns: { userId: true },
        where: (userToCommunity, { eq }) => eq(userToCommunity.joined, true),
      },
    },
  })
  .prepare("selected_community");

export const getUserToCommunity = db.query.usersToCommunities
  .findFirst({
    where: (userToCommunity, { sql, and, eq, exists }) =>
      and(
        eq(userToCommunity.userId, sql.placeholder("currentUserId")),
        exists(
          db
            .select()
            .from(communities)
            .where(
              and(
                eq(communities.id, userToCommunity.communityId),
                eq(communities.name, sql.placeholder("communityName")),
              ),
            ),
        ),
      ),
    columns: { favorited: true, muted: true, joined: true },
  })
  .prepare("user_to_community");

export const getCommunityImage = db.query.communities
  .findFirst({
    where: (community, { eq, sql }) =>
      eq(community.name, sql.placeholder("communityName")),
    columns: { icon: true },
  })
  .prepare("community_imageUrl");
