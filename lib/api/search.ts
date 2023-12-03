import db from "../db";

export const searchUsers = db.query.users
  .findMany({
    where: (user, { ilike, sql }) =>
      ilike(user.name, sql.placeholder("search")),
    columns: { id: false },
    limit: 4,
    with: {
      usersToComments: { columns: { upvoted: true, downvoted: true } },
      usersToPosts: { columns: { upvoted: true, downvoted: true } },
      communities: {
        columns: {},
        with: {
          usersToCommunities: {
            columns: { communityId: true },
            where: (userToCommunity, { eq }) =>
              eq(userToCommunity.member, true),
          },
        },
      },
    },
  })
  .prepare("getSearchedUsers");

export const searchCommunities = db.query.communities
  .findMany({
    where: (community, { ilike, sql }) =>
      ilike(community.name, sql.placeholder("search")),
    columns: { name: true, imageUrl: true, nsfw: true },
    limit: 4,
    with: {
      usersToCommunities: {
        where: (userToCommunity, { eq }) => eq(userToCommunity.member, true),
        columns: { communityId: true },
      },
    },
  })
  .prepare("getSearchedCommunities");
