import db from "../db";

export const searchUsers = db.query.users
  .findMany({
    where: (user, { ilike, sql }) =>
      ilike(user.name, sql.placeholder("search")),
    columns: { id: false },
    limit: 4,
    with: {
      usersToComments: { columns: { voteStatus: true } },
      usersToPosts: { columns: { voteStatus: true } },
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
  .prepare("get_searched_users");

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
  .prepare("get_searched_communities");
