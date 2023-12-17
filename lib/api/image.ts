import db from "../db";

export const getUserImage = db.query.users
  .findFirst({
    where: (user, { eq, sql }) => eq(user.name, sql.placeholder("name")),
    columns: { imageUrl: true },
  })
  .prepare("get_user_image_url");

export const getCommunityImage = db.query.communities
  .findFirst({
    where: (community, { eq, sql }) =>
      eq(community.name, sql.placeholder("name")),
    columns: { imageUrl: true },
  })
  .prepare("get_community_imageUrl");
