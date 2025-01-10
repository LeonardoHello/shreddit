import db from "../db";

export const getCommunityByName = db.query.communities
  .findFirst({
    where: (community, { sql, eq }) =>
      eq(community.name, sql.placeholder("communityName")),
    with: {
      usersToCommunities: true,
    },
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
        where: (userToCommunity, { eq }) => eq(userToCommunity.member, true),
      },
    },
  })
  .prepare("selected_community");

export const getUserToCommunity = db.query.usersToCommunities
  .findFirst({
    where: (community, { sql, and, eq }) =>
      and(
        eq(community.communityId, sql.placeholder("communityId")),
        eq(community.userId, sql.placeholder("userId")),
      ),
    columns: { favorite: true, muted: true, member: true },
  })
  .prepare("user_to_community");

export const getCommunityImage = db.query.communities
  .findFirst({
    where: (community, { eq, sql }) =>
      eq(community.name, sql.placeholder("communityName")),
    columns: { icon: true },
  })
  .prepare("community_imageUrl");
