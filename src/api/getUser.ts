import db from "../db";

export const getUserByName = db.query.users
  .findFirst({
    where: (user, { sql, eq }) =>
      eq(user.username, sql.placeholder("username")),
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
        columns: { id: true, icon: true, name: true },
        with: {
          usersToCommunities: {
            columns: { communityId: true },
            where: (userToCommunity, { eq }) =>
              eq(userToCommunity.joined, true),
          },
        },
      },
    },
  })
  .prepare("user_by_name");
