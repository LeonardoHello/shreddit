import db from "@/db";
import { usersToPosts } from "@/db/schema";
import { PostSort } from "@/types";
import { monthAgo } from "@/utils/getLastMonthDate";
import { postQueryConfig } from "@/utils/getPostsQueryConfig";

export const getUpvotedBestPosts = db.query.posts
  .findMany({
    ...postQueryConfig(),
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToPosts)
          .where(
            and(
              eq(usersToPosts.postId, post.id),
              eq(usersToPosts.userId, sql.placeholder("userId")),
              eq(usersToPosts.voteStatus, "upvoted"),
            ),
          ),
      ),
  })
  .prepare("get_upvoted_best_posts");

export const getUpvotedHotPosts = db.query.posts
  .findMany({
    ...postQueryConfig(PostSort.HOT),
    where: (post, { sql, exists, and, eq, gt }) =>
      and(
        exists(
          db
            .select()
            .from(usersToPosts)
            .where(
              and(
                eq(usersToPosts.postId, post.id),
                eq(usersToPosts.userId, sql.placeholder("userId")),
                eq(usersToPosts.voteStatus, "upvoted"),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      ),
  })
  .prepare("get_upvoted_hot_posts");

export const getUpvotedNewPosts = db.query.posts
  .findMany({
    ...postQueryConfig(PostSort.NEW),
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToPosts)
          .where(
            and(
              eq(usersToPosts.postId, post.id),
              eq(usersToPosts.userId, sql.placeholder("userId")),
              eq(usersToPosts.voteStatus, "upvoted"),
            ),
          ),
      ),
  })
  .prepare("get_upvoted_new_posts");

export const getUpvotedControversialPosts = db.query.posts
  .findMany({
    ...postQueryConfig(PostSort.CONTROVERSIAL),
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToPosts)
          .where(
            and(
              eq(usersToPosts.postId, post.id),
              eq(usersToPosts.userId, sql.placeholder("userId")),
              eq(usersToPosts.voteStatus, "upvoted"),
            ),
          ),
      ),
  })
  .prepare("get_upvoted_controversial_posts");
