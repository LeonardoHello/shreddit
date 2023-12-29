import db from "@/lib/db";
import { usersToCommunities } from "@/lib/db/schema";
import postsQueryConfig from "@/lib/utils/getPostsBaseQueryConfig";

export const getHomeBestPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToCommunities)
          .where(
            and(
              eq(usersToCommunities.userId, sql.placeholder("userId")),
              eq(usersToCommunities.member, true),
              eq(usersToCommunities.userId, post.authorId),
            ),
          ),
      ),
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_home_best_posts");

export const getHomeHotPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: {
      usersToPosts: true,
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
            .from(usersToCommunities)
            .where(
              and(
                eq(usersToCommunities.userId, sql.placeholder("userId")),
                eq(usersToCommunities.member, true),
                eq(usersToCommunities.userId, post.authorId),
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
  .prepare("get_home_hot_posts");

export const getHomeNewPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToCommunities)
          .where(
            and(
              eq(usersToCommunities.userId, sql.placeholder("userId")),
              eq(usersToCommunities.member, true),
              eq(usersToCommunities.userId, post.authorId),
            ),
          ),
      ),
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_home_new_posts");

export const getHomeControversialPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToCommunities)
          .where(
            and(
              eq(usersToCommunities.userId, sql.placeholder("userId")),
              eq(usersToCommunities.member, true),
              eq(usersToCommunities.userId, post.authorId),
            ),
          ),
      ),
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_home_controversial_posts");
