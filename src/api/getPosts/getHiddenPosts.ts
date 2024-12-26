import db from "@/db";
import { usersToPosts } from "@/db/schema";
import { PostSort } from "@/types";
import { postQueryConfig } from "@/utils/getPostsQueryConfig";

export const getHiddenBestPosts = db.query.posts
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
              eq(usersToPosts.hidden, true),
            ),
          ),
      ),
  })
  .prepare("get_hidden_best_posts");

export const getHiddenHotPosts = db.query.posts
  .findMany({
    ...postQueryConfig(PostSort.HOT),
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return and(
        exists(
          db
            .select()
            .from(usersToPosts)
            .where(
              and(
                eq(usersToPosts.postId, post.id),
                eq(usersToPosts.userId, sql.placeholder("userId")),
                eq(usersToPosts.hidden, true),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      );
    },
  })
  .prepare("get_hidden_hot_posts");

export const getHiddenNewPosts = db.query.posts
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
              eq(usersToPosts.hidden, true),
            ),
          ),
      ),
  })
  .prepare("get_hidden_new_posts");

export const getHiddenControversialPosts = db.query.posts
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
              eq(usersToPosts.hidden, true),
            ),
          ),
      ),
  })
  .prepare("get_hidden_controversial_posts");
