import db from "@/db";
import { usersToPosts } from "@/db/schema";
import { postQueryConfig } from "@/utils/getPostsQueryConfig";

export const getSavedBestPosts = db.query.posts
  .findMany({
    ...postQueryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToPosts)
          .where(
            and(
              eq(usersToPosts.postId, post.id),
              eq(usersToPosts.userId, sql.placeholder("userId")),
              eq(usersToPosts.saved, true),
            ),
          ),
      ),
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_saved_best_posts");

export const getSavedHotPosts = db.query.posts
  .findMany({
    ...postQueryConfig,
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
                eq(usersToPosts.saved, true),
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
  .prepare("get_saved_hot_posts");

export const getSavedNewPosts = db.query.posts
  .findMany({
    ...postQueryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToPosts)
          .where(
            and(
              eq(usersToPosts.postId, post.id),
              eq(usersToPosts.userId, sql.placeholder("userId")),
              eq(usersToPosts.saved, true),
            ),
          ),
      ),
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_saved_new_posts");

export const getSavedControversialPosts = db.query.posts
  .findMany({
    ...postQueryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToPosts)
          .where(
            and(
              eq(usersToPosts.postId, post.id),
              eq(usersToPosts.userId, sql.placeholder("userId")),
              eq(usersToPosts.saved, true),
            ),
          ),
      ),
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_saved_controversial_posts");
