import db from "@/db";
import { users } from "@/db/schema";
import { postQueryConfig } from "@/utils/getPostsQueryConfig";

export const getUserBestPosts = db.query.posts
  .findMany({
    ...postQueryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(users)
          .where(
            and(
              eq(users.id, post.authorId),
              eq(users.name, sql.placeholder("userName")),
            ),
          ),
      ),
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_user_best_posts");

export const getUserHotPosts = db.query.posts
  .findMany({
    ...postQueryConfig,
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return and(
        exists(
          db
            .select()
            .from(users)
            .where(
              and(
                eq(users.id, post.authorId),
                eq(users.name, sql.placeholder("userName")),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      );
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_user_hot_posts");

export const getUserNewPosts = db.query.posts
  .findMany({
    ...postQueryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(users)
          .where(
            and(
              eq(users.id, post.authorId),
              eq(users.name, sql.placeholder("userName")),
            ),
          ),
      ),
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_user_new_posts");

export const getUserControversialPosts = db.query.posts
  .findMany({
    ...postQueryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(users)
          .where(
            and(
              eq(users.id, post.authorId),
              eq(users.name, sql.placeholder("userName")),
            ),
          ),
      ),
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_user_controversial_posts");
