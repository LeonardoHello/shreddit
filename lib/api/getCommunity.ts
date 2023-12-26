import db from "../db";

export const getCommunity = db.query.communities
  .findFirst({
    where: (community, { sql, eq }) =>
      eq(community.name, sql.placeholder("communityName")),
    with: {
      usersToCommunities: true,
    },
  })
  .prepare("get_community");

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
