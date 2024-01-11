import db from "../db";

export const getCommunityByName = db.query.communities
  .findFirst({
    where: (community, { sql, eq }) =>
      eq(community.name, sql.placeholder("communityName")),
    with: {
      usersToCommunities: true,
    },
  })
  .prepare("get_community_by_name");

export const getUserToCommunity = db.query.usersToCommunities
  .findFirst({
    where: (community, { sql, and, eq }) =>
      and(
        eq(community.communityId, sql.placeholder("communityId")),
        eq(community.userId, sql.placeholder("userId")),
      ),
    columns: { favorite: true, muted: true, member: true },
  })
  .prepare("get_user_to_community");

export const getCommunityImage = db.query.communities
  .findFirst({
    where: (community, { eq, sql }) =>
      eq(community.name, sql.placeholder("name")),
    columns: { imageUrl: true },
  })
  .prepare("get_community_imageUrl");
