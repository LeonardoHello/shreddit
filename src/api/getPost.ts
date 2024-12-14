import db from "@/db";
import { postQueryConfig } from "../utils/getPostsQueryConfig";

export const getPostById = db.query.posts
  .findFirst({
    where: (post, { sql, eq }) => eq(post.id, sql.placeholder("postId")),
    with: postQueryConfig.with,
    extras: postQueryConfig.extras,
  })
  .prepare("get_post_by_id");
