import db from "@/db";
import { usersToPosts } from "@/db/schema";
import { PostSort } from "@/types";
import { monthAgo } from "@/utils/getLastMonthDate";
import { postQueryConfig } from "@/utils/getPostsQueryConfig";

export const getSavedBestPosts = db.query.posts
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
              eq(usersToPosts.saved, true),
            ),
          ),
      ),
  })
  .prepare("get_saved_best_posts");

export const getSavedHotPosts = db.query.posts
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
                eq(usersToPosts.saved, true),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      ),
  })
  .prepare("get_saved_hot_posts");

export const getSavedNewPosts = db.query.posts
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
              eq(usersToPosts.saved, true),
            ),
          ),
      ),
  })
  .prepare("get_saved_new_posts");

export const getSavedControversialPosts = db.query.posts
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
              eq(usersToPosts.saved, true),
            ),
          ),
      ),
  })
  .prepare("get_saved_controversial_posts");
