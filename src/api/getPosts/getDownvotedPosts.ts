import db from "@/db";
import { usersToPosts } from "@/db/schema";
import {
  bestPosts,
  controversialPosts,
  hotPosts,
  newPosts,
} from "@/utils/postsQueryConfig";

export const getDownvotedBestPosts = db.query.posts
  .findMany({
    ...bestPosts,
    where: (post, filter) => {
      const { sql, exists, and, eq } = filter;

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
        bestPosts.where(post, filter),
      );
    },
  })
  .prepare("downvoted_best_posts");

export const getDownvotedHotPosts = db.query.posts
  .findMany({
    ...hotPosts,
    where: (post, filter) => {
      const { sql, exists, and, eq } = filter;

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
        hotPosts.where(post, filter),
      );
    },
  })
  .prepare("downvoted_hot_posts");

export const getDownvotedNewPosts = db.query.posts
  .findMany({
    ...newPosts,
    where: (post, filter) => {
      const { sql, exists, and, eq } = filter;

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
        newPosts.where(post, filter),
      );
    },
  })
  .prepare("downvoted_new_posts");

export const getDownvotedControversialPosts = db.query.posts
  .findMany({
    ...controversialPosts,
    where: (post, filter) => {
      const { sql, exists, and, eq } = filter;

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
        controversialPosts.where(post, filter),
      );
    },
  })
  .prepare("downvoted_controversial_posts");
