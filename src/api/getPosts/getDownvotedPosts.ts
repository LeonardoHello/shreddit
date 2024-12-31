import db from "@/db";
import { usersToPosts } from "@/db/schema";
import { PostSort } from "@/types";
import { postsQueryConfig } from "@/utils/postsQueryConfig";

const bestDownvotedPosts = postsQueryConfig({
  showHidden: true,
});
const hotDownvotedPosts = postsQueryConfig({
  sort: PostSort.HOT,
  showHidden: true,
});
const newDownvotedPosts = postsQueryConfig({
  sort: PostSort.NEW,
  showHidden: true,
});
const controversialDownvotedPosts = postsQueryConfig({
  sort: PostSort.CONTROVERSIAL,
  showHidden: true,
});

export const getDownvotedBestPosts = db.query.posts
  .findMany({
    ...bestDownvotedPosts,
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
                eq(usersToPosts.userId, sql.placeholder("currentUserId")),
                eq(usersToPosts.voteStatus, "downvoted"),
              ),
            ),
        ),
        bestDownvotedPosts.where(post, filter),
      );
    },
  })
  .prepare("downvoted_best_posts");

export const getDownvotedHotPosts = db.query.posts
  .findMany({
    ...hotDownvotedPosts,
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
                eq(usersToPosts.userId, sql.placeholder("currentUserId")),
                eq(usersToPosts.voteStatus, "downvoted"),
              ),
            ),
        ),
        hotDownvotedPosts.where(post, filter),
      );
    },
  })
  .prepare("downvoted_hot_posts");

export const getDownvotedNewPosts = db.query.posts
  .findMany({
    ...newDownvotedPosts,
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
                eq(usersToPosts.userId, sql.placeholder("currentUserId")),
                eq(usersToPosts.voteStatus, "downvoted"),
              ),
            ),
        ),
        newDownvotedPosts.where(post, filter),
      );
    },
  })
  .prepare("downvoted_new_posts");

export const getDownvotedControversialPosts = db.query.posts
  .findMany({
    ...controversialDownvotedPosts,
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
                eq(usersToPosts.userId, sql.placeholder("currentUserId")),
                eq(usersToPosts.voteStatus, "downvoted"),
              ),
            ),
        ),
        controversialDownvotedPosts.where(post, filter),
      );
    },
  })
  .prepare("downvoted_controversial_posts");
