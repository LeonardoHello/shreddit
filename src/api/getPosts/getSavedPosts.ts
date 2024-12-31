import db from "@/db";
import { usersToPosts } from "@/db/schema";
import { PostSort } from "@/types";
import { postsQueryConfig } from "@/utils/postsQueryConfig";

const bestSavedPosts = postsQueryConfig({
  showHidden: true,
});
const hotSavedPosts = postsQueryConfig({
  sort: PostSort.HOT,
  showHidden: true,
});
const newSavedPosts = postsQueryConfig({
  sort: PostSort.NEW,
  showHidden: true,
});
const controversialSavedPosts = postsQueryConfig({
  sort: PostSort.CONTROVERSIAL,
  showHidden: true,
});

export const getSavedBestPosts = db.query.posts
  .findMany({
    ...bestSavedPosts,
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
                eq(usersToPosts.saved, true),
              ),
            ),
        ),
        bestSavedPosts.where(post, filter),
      );
    },
  })
  .prepare("saved_best_posts");

export const getSavedHotPosts = db.query.posts
  .findMany({
    ...hotSavedPosts,
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
                eq(usersToPosts.saved, true),
              ),
            ),
        ),
        hotSavedPosts.where(post, filter),
      );
    },
  })
  .prepare("saved_hot_posts");

export const getSavedNewPosts = db.query.posts
  .findMany({
    ...newSavedPosts,
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
                eq(usersToPosts.saved, true),
              ),
            ),
        ),
        newSavedPosts.where(post, filter),
      );
    },
  })
  .prepare("saved_new_posts");

export const getSavedControversialPosts = db.query.posts
  .findMany({
    ...controversialSavedPosts,
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
                eq(usersToPosts.saved, true),
              ),
            ),
        ),
        controversialSavedPosts.where(post, filter),
      );
    },
  })
  .prepare("saved_controversial_posts");
