import db from "@/lib/db";
import { postQueryWithConfig } from "@/lib/utils/getPostsQueryConfig";

export const getPostById = db.query.posts
  .findFirst({
    with: postQueryWithConfig,
    where: (post, { sql, eq }) => eq(post.id, sql.placeholder("postId")),
  })
  .prepare("get_post_by_id");
