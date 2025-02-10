import db from "@/db";
import { PostSort } from "@/types/enums";
import { postsQueryConfig } from "@/utils/postsQueryConfig";

export const getPostById = db.query.posts
  .findFirst({
    where: (post, { sql, eq }) => eq(post.id, sql.placeholder("postId")),
    with: postsQueryConfig({ postSort: PostSort.BEST }).with,
    extras: postsQueryConfig({ postSort: PostSort.BEST }).extras,
  })

  .prepare("post_by_id");
