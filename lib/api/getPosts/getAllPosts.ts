import db from "@/lib/db";
import {
  controversialPostsQueryConfig,
  postQueryWithConfig,
  postsQueryConfig,
  topPostsQueryConfig,
} from "@/lib/utils/getPostsQueryConfig";

export const getAllBestPosts = db.query.posts
  .findMany({
    ...topPostsQueryConfig,
    with: postQueryWithConfig,
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_all_best_posts");

export const getAllHotPosts = db.query.posts
  .findMany({
    ...topPostsQueryConfig,
    with: postQueryWithConfig,
    where: (post, { gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return gt(post.createdAt, monthAgo);
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_all_hot_posts");

export const getAllNewPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: postQueryWithConfig,
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_all_posts");

export const getAllControversialPosts = db.query.posts
  .findMany({
    ...controversialPostsQueryConfig,
    with: postQueryWithConfig,
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_all_controversial_posts");
