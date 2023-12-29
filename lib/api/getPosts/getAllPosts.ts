import db from "@/lib/db";
import postsQueryConfig from "@/lib/utils/getPostsBaseQueryConfig";

export const getAllBestPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_all_best_posts");

export const getAllHotPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
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
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_all_posts");

export const getAllControversialPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_all_controversial_posts");
