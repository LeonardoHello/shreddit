import db from "@/db";
import { usersToPosts } from "@/db/schema";
import { postQueryConfig } from "@/utils/getPostsQueryConfig";

export const getDownvotedBestPosts = db.query.posts
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
              eq(usersToPosts.voteStatus, "downvoted"),
            ),
          ),
      ),
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_downvoted_best_posts");

export const getDownvotedHotPosts = db.query.posts
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
                eq(usersToPosts.voteStatus, "downvoted"),
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
  .prepare("get_downvoted_hot_posts");

export const getDownvotedNewPosts = db.query.posts
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
              eq(usersToPosts.voteStatus, "downvoted"),
            ),
          ),
      ),
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_downvoted_new_posts");

export const getDownvotedControversialPosts = db.query.posts
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
              eq(usersToPosts.voteStatus, "downvoted"),
            ),
          ),
      ),
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_downvoted_controversial_posts");
