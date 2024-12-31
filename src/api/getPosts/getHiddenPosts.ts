import db from "@/db";
import { usersToPosts } from "@/db/schema";
import { PostSort } from "@/types";
import { postsQueryConfig } from "@/utils/postsQueryConfig";

const bestHiddenPosts = postsQueryConfig({
  showHidden: true,
});
const hotHiddenPosts = postsQueryConfig({
  sort: PostSort.HOT,
  showHidden: true,
});
const newHiddenPosts = postsQueryConfig({
  sort: PostSort.NEW,
  showHidden: true,
});
const controversialHiddenPosts = postsQueryConfig({
  sort: PostSort.CONTROVERSIAL,
  showHidden: true,
});

export const getHiddenBestPosts = db.query.posts
  .findMany({
    ...bestHiddenPosts,
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
                eq(usersToPosts.hidden, true),
              ),
            ),
        ),
        bestHiddenPosts.where(post, filter),
      );
    },
  })
  .prepare("hidden_best_posts");

export const getHiddenHotPosts = db.query.posts
  .findMany({
    ...hotHiddenPosts,
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
                eq(usersToPosts.hidden, true),
              ),
            ),
        ),
        hotHiddenPosts.where(post, filter),
      );
    },
  })
  .prepare("hidden_hot_posts");

export const getHiddenNewPosts = db.query.posts
  .findMany({
    ...newHiddenPosts,
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
                eq(usersToPosts.hidden, true),
              ),
            ),
        ),
        newHiddenPosts.where(post, filter),
      );
    },
  })
  .prepare("hidden_new_posts");

export const getHiddenControversialPosts = db.query.posts
  .findMany({
    ...controversialHiddenPosts,
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
                eq(usersToPosts.hidden, true),
              ),
            ),
        ),
        controversialHiddenPosts.where(post, filter),
      );
    },
  })
  .prepare("hidden_controversial_posts");
