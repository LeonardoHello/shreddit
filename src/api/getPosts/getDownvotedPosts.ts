import db from "@/db";
import { usersToPosts } from "@/db/schema";
import { PostSort } from "@/types";
import { monthAgo } from "@/utils/getLastMonthDate";
import { postQueryConfig } from "@/utils/getPostsQueryConfig";

export const getDownvotedBestPosts = db.query.posts
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
              eq(usersToPosts.voteStatus, "downvoted"),
            ),
          ),
      ),
  })
  .prepare("get_downvoted_best_posts");

export const getDownvotedHotPosts = db.query.posts
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
                eq(usersToPosts.voteStatus, "downvoted"),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      ),
  })
  .prepare("get_downvoted_hot_posts");

export const getDownvotedNewPosts = db.query.posts
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
              eq(usersToPosts.voteStatus, "downvoted"),
            ),
          ),
      ),
  })
  .prepare("get_downvoted_new_posts");

export const getDownvotedControversialPosts = db.query.posts
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
              eq(usersToPosts.voteStatus, "downvoted"),
            ),
          ),
      ),
  })
  .prepare("get_downvoted_controversial_posts");
