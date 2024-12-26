import db from "../db";

export const searchUsers = db.query.users
  .findMany({
    where: (user, { ilike, sql }) =>
      ilike(user.name, sql.placeholder("search")),
    columns: { id: false },
    limit: 4,
    with: {
      usersToComments: {
        where: (userToCommunity, { ne }) =>
          ne(userToCommunity.voteStatus, "none"),
        columns: { voteStatus: true },
      },
      usersToPosts: {
        where: (userToCommunity, { ne }) =>
          ne(userToCommunity.voteStatus, "none"),
        columns: { voteStatus: true },
      },
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
  .prepare("searched_users");

export const searchCommunities = db.query.communities
  .findMany({
    where: (community, { ilike, sql }) =>
      ilike(community.name, sql.placeholder("search")),
    columns: { id: true, name: true, imageUrl: true },
    limit: 4,
    with: {
      usersToCommunities: {
        where: (userToCommunity, { eq }) => eq(userToCommunity.member, true),
        columns: { userId: true },
      },
    },
  })
  .prepare("searched_communities");
