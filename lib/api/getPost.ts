import db from "@/lib/db";

import postsQueryConfig from "../utils/getPostsBaseQueryConfig";

export const getPost = db.query.posts
  .findFirst({
    extras: postsQueryConfig.extras,
    with: {
      usersToPosts: { columns: { postId: false, createdAt: false } },
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    where: (post, { sql, eq }) => eq(post.id, sql.placeholder("postId")),
  })
  .prepare("get_post");
