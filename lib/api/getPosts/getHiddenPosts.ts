import db from "@/lib/db";
import { usersToPosts } from "@/lib/db/schema";
import {
  controversialPostsQueryConfig,
  postQueryWithConfig,
  postsQueryConfig,
  topPostsQueryConfig,
} from "@/lib/utils/getPostsQueryConfig";

export const getHiddenBestPosts = db.query.posts
  .findMany({
    ...topPostsQueryConfig,
    with: postQueryWithConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToPosts)
          .where(
            and(
              eq(usersToPosts.postId, post.id),
              eq(usersToPosts.userId, sql.placeholder("userId")),
              eq(usersToPosts.hidden, true),
            ),
          ),
      ),
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_hidden_best_posts");

export const getHiddenHotPosts = db.query.posts
  .findMany({
    ...topPostsQueryConfig,
    with: postQueryWithConfig,
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return and(
        exists(
          db
            .select()
            .from(usersToPosts)
            .where(
              and(
                eq(usersToPosts.postId, post.id),
                eq(usersToPosts.userId, sql.placeholder("userId")),
                eq(usersToPosts.hidden, true),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      );
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_hidden_hot_posts");

export const getHiddenNewPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: postQueryWithConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToPosts)
          .where(
            and(
              eq(usersToPosts.postId, post.id),
              eq(usersToPosts.userId, sql.placeholder("userId")),
              eq(usersToPosts.hidden, true),
            ),
          ),
      ),
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_hidden_new_posts");

export const getHiddenControversialPosts = db.query.posts
  .findMany({
    ...controversialPostsQueryConfig,
    with: postQueryWithConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToPosts)
          .where(
            and(
              eq(usersToPosts.postId, post.id),
              eq(usersToPosts.userId, sql.placeholder("userId")),
              eq(usersToPosts.hidden, true),
            ),
          ),
      ),
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_hidden_controversial_posts");
