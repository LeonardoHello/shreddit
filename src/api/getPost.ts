import db from "@/db";
import { bestPostsQueryConfig } from "@/utils/postsQueryConfig";

const postFilter = {
  hideHidden: false,
  hideCommunityMuted: false,
};

export const getPostById = db.query.posts
  .findFirst({
    where: (post, { sql, eq }) => eq(post.id, sql.placeholder("postId")),
    with: bestPostsQueryConfig(postFilter).with,
    extras: bestPostsQueryConfig(postFilter).extras,
  })
  .prepare("post_by_id");
