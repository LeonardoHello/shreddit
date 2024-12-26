import db from "@/db";
import { postsQueryConfig } from "../utils/postsQueryConfig";

export const getPostById = db.query.posts
  .findFirst({
    where: (post, { sql, eq }) => eq(post.id, sql.placeholder("postId")),
    with: postsQueryConfig({}).with,
    extras: postsQueryConfig({}).extras,
  })
  .prepare("post_by_id");
