import db from "../db";

export const getUserByName = db.query.users
  .findFirst({
    where: (user, { sql, eq }) => eq(user.name, sql.placeholder("userName")),
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
  .prepare("get_user_by_name");

export const getUserById = db.query.users
  .findFirst({
    where: (user, { sql, eq }) => eq(user.id, sql.placeholder("currentUserId")),
    columns: { createdAt: false },
  })
  .prepare("get_user_by_id");

export const getUserImage = db.query.users
  .findFirst({
    where: (user, { eq, sql }) => eq(user.name, sql.placeholder("name")),
    columns: { imageUrl: true },
  })
  .prepare("get_user_image_url");
