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
        columns: { id: true, imageUrl: true, name: true },
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
  .prepare("user_by_name");

export const getUserById = db.query.users
  .findFirst({
    where: (user, { sql, eq }) => eq(user.id, sql.placeholder("currentUserId")),
    columns: { createdAt: false },
  })
  .prepare("user_by_id");

export const getUserImage = db.query.users
  .findFirst({
    where: (user, { eq, sql }) =>
      eq(user.username, sql.placeholder("username")),
    columns: { imageUrl: true },
  })
  .prepare("user_image_url");
