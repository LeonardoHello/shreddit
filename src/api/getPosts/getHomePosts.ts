import db from "@/db";
import { usersToCommunities } from "@/db/schema";
import { PostSort } from "@/types";
import { postsQueryConfig } from "@/utils/postsQueryConfig";

const bestHomePosts = postsQueryConfig({
  hideMuted: true,
});
const hotHomePosts = postsQueryConfig({
  sort: PostSort.HOT,
  hideMuted: true,
});
const newHomePosts = postsQueryConfig({
  sort: PostSort.NEW,
  hideMuted: true,
});
const controversialHomePosts = postsQueryConfig({
  sort: PostSort.CONTROVERSIAL,
  hideMuted: true,
});

export const getHomeBestPosts = db.query.posts
  .findMany({
    ...bestHomePosts,
    where: (post, filter) => {
      const { sql, exists, and, eq } = filter;

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
        bestHomePosts.where(post, filter),
      );
    },
  })
  .prepare("home_best_posts");

export const getHomeHotPosts = db.query.posts
  .findMany({
    ...hotHomePosts,
    where: (post, filter) => {
      const { sql, exists, and, eq } = filter;

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
        hotHomePosts.where(post, filter),
      );
    },
  })
  .prepare("home_hot_posts");

export const getHomeNewPosts = db.query.posts
  .findMany({
    ...newHomePosts,
    where: (post, filter) => {
      const { sql, exists, and, eq } = filter;

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
        newHomePosts.where(post, filter),
      );
    },
  })
  .prepare("home_new_posts");

export const getHomeControversialPosts = db.query.posts
  .findMany({
    ...controversialHomePosts,
    where: (post, filter) => {
      const { sql, exists, and, eq } = filter;

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
        controversialHomePosts.where(post, filter),
      );
    },
  })
  .prepare("home_controversial_posts");
