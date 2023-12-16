import db from "../db";

export const getUserImageUrl = db.query.users
  .findFirst({
    where: (user, { eq, sql }) => eq(user.name, sql.placeholder("name")),
    columns: { imageUrl: true },
  })
  .prepare("get_user_image_url");

export const getCommunityImageUrl = db.query.communities
  .findFirst({
    where: (community, { eq, sql }) =>
      eq(community.name, sql.placeholder("name")),
    columns: { imageUrl: true },
  })
  .prepare("get_community_imageUrl");
