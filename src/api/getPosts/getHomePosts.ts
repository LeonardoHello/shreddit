import db from "@/db";
import { usersToCommunities } from "@/db/schema";
import { PostSort } from "@/types";
import { postQueryConfig } from "@/utils/getPostsQueryConfig";

export const getHomeBestPosts = db.query.posts
  .findMany({
    ...postQueryConfig(),
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToCommunities)
          .where(
            and(
              eq(usersToCommunities.userId, sql.placeholder("currentUserId")),
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
    ...postQueryConfig(PostSort.HOT),
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
                eq(usersToCommunities.userId, sql.placeholder("currentUserId")),
                eq(usersToCommunities.member, true),
                eq(usersToCommunities.userId, post.authorId),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      );
    },
  })
  .prepare("get_home_hot_posts");

export const getHomeNewPosts = db.query.posts
  .findMany({
    ...postQueryConfig(PostSort.NEW),
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToCommunities)
          .where(
            and(
              eq(usersToCommunities.userId, sql.placeholder("currentUserId")),
              eq(usersToCommunities.member, true),
              eq(usersToCommunities.userId, post.authorId),
            ),
          ),
      ),
  })
  .prepare("get_home_new_posts");

export const getHomeControversialPosts = db.query.posts
  .findMany({
    ...postQueryConfig(PostSort.CONTROVERSIAL),
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToCommunities)
          .where(
            and(
              eq(usersToCommunities.userId, sql.placeholder("currentUserId")),
              eq(usersToCommunities.member, true),
              eq(usersToCommunities.userId, post.authorId),
            ),
          ),
      ),
  })
  .prepare("get_home_controversial_posts");
