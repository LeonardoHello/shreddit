import db from "@/db";
import { usersToPosts } from "@/db/schema";
import {
  bestPosts,
  controversialPosts,
  hotPosts,
  newPosts,
} from "@/utils/postsQueryConfig";

export const getUpvotedBestPosts = db.query.posts
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
                eq(usersToPosts.voteStatus, "upvoted"),
              ),
            ),
        ),
        bestPosts.where(post, filter),
      );
    },
  })
  .prepare("upvoted_best_posts");

export const getUpvotedHotPosts = db.query.posts
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
                eq(usersToPosts.voteStatus, "upvoted"),
              ),
            ),
        ),
        hotPosts.where(post, filter),
      );
    },
  })
  .prepare("upvoted_hot_posts");

export const getUpvotedNewPosts = db.query.posts
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
                eq(usersToPosts.voteStatus, "upvoted"),
              ),
            ),
        ),
        newPosts.where(post, filter),
      );
    },
  })
  .prepare("upvoted_new_posts");

export const getUpvotedControversialPosts = db.query.posts
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
                eq(usersToPosts.voteStatus, "upvoted"),
              ),
            ),
        ),
        controversialPosts.where(post, filter),
      );
    },
  })
  .prepare("upvoted_controversial_posts");
