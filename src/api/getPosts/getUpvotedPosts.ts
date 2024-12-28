import db from "@/db";
import { usersToPosts } from "@/db/schema";
import { PostSort } from "@/types";
import { postsQueryConfig } from "@/utils/postsQueryConfig";

const bestUpvotedPosts = postsQueryConfig({
  showHidden: true,
});
const hotUpvotedPosts = postsQueryConfig({
  sort: PostSort.HOT,
  showHidden: true,
});
const newUpvotedPosts = postsQueryConfig({
  sort: PostSort.NEW,
  showHidden: true,
});
const controversialUpvotedPosts = postsQueryConfig({
  sort: PostSort.CONTROVERSIAL,
  showHidden: true,
});

export const getUpvotedBestPosts = db.query.posts
  .findMany({
    ...bestUpvotedPosts,
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
        bestUpvotedPosts.where(post, filter),
      );
    },
  })
  .prepare("upvoted_best_posts");

export const getUpvotedHotPosts = db.query.posts
  .findMany({
    ...hotUpvotedPosts,
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
        hotUpvotedPosts.where(post, filter),
      );
    },
  })
  .prepare("upvoted_hot_posts");

export const getUpvotedNewPosts = db.query.posts
  .findMany({
    ...newUpvotedPosts,
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
        newUpvotedPosts.where(post, filter),
      );
    },
  })
  .prepare("upvoted_new_posts");

export const getUpvotedControversialPosts = db.query.posts
  .findMany({
    ...controversialUpvotedPosts,
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
        controversialUpvotedPosts.where(post, filter),
      );
    },
  })
  .prepare("upvoted_controversial_posts");
