import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import postsQueryConfig from "@/lib/utils/getPostsBaseQueryConfig";

export const getUserBestPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: {
      usersToPosts: { columns: { postId: false, createdAt: false } },
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
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
    ...postsQueryConfig,
    with: {
      usersToPosts: { columns: { postId: false, createdAt: false } },
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
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
    ...postsQueryConfig,
    with: {
      usersToPosts: { columns: { postId: false, createdAt: false } },
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
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
    ...postsQueryConfig,
    with: {
      usersToPosts: { columns: { postId: false, createdAt: false } },
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
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
