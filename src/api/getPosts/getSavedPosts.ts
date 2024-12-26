import db from "@/db";
import { usersToPosts } from "@/db/schema";
import {
  bestPosts,
  controversialPosts,
  hotPosts,
  newPosts,
} from "@/utils/postsQueryConfig";

export const getSavedBestPosts = db.query.posts
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
                eq(usersToPosts.saved, true),
              ),
            ),
        ),
        bestPosts.where(post, filter),
      );
    },
  })
  .prepare("saved_best_posts");

export const getSavedHotPosts = db.query.posts
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
                eq(usersToPosts.saved, true),
              ),
            ),
        ),
        hotPosts.where(post, filter),
      );
    },
  })
  .prepare("saved_hot_posts");

export const getSavedNewPosts = db.query.posts
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
                eq(usersToPosts.saved, true),
              ),
            ),
        ),
        newPosts.where(post, filter),
      );
    },
  })
  .prepare("saved_new_posts");

export const getSavedControversialPosts = db.query.posts
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
                eq(usersToPosts.saved, true),
              ),
            ),
        ),
        controversialPosts.where(post, filter),
      );
    },
  })
  .prepare("saved_controversial_posts");
