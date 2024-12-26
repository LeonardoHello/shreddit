import db from "@/db";
import { users } from "@/db/schema";
import {
  bestPosts,
  controversialPosts,
  hotPosts,
  newPosts,
} from "@/utils/postsQueryConfig";

export const getUserBestPosts = db.query.posts
  .findMany({
    ...bestPosts,
    where: (post, filter) => {
      const { sql, exists, and, eq } = filter;

      return and(
        exists(
          db
            .select()
            .from(users)
            .where(
              and(
                eq(users.id, post.authorId),
                eq(users.name, sql.placeholder("username")),
              ),
            ),
        ),
        bestPosts.where(post, filter),
      );
    },
  })
  .prepare("user_best_posts");

export const getUserHotPosts = db.query.posts
  .findMany({
    ...hotPosts,
    where: (post, filter) => {
      const { sql, exists, and, eq } = filter;

      return and(
        exists(
          db
            .select()
            .from(users)
            .where(
              and(
                eq(users.id, post.authorId),
                eq(users.name, sql.placeholder("username")),
              ),
            ),
        ),
        hotPosts.where(post, filter),
      );
    },
  })
  .prepare("user_hot_posts");

export const getUserNewPosts = db.query.posts
  .findMany({
    ...newPosts,
    where: (post, filter) => {
      const { sql, exists, and, eq } = filter;

      return and(
        exists(
          db
            .select()
            .from(users)
            .where(
              and(
                eq(users.id, post.authorId),
                eq(users.name, sql.placeholder("username")),
              ),
            ),
        ),
        newPosts.where(post, filter),
      );
    },
  })
  .prepare("user_new_posts");

export const getUserControversialPosts = db.query.posts
  .findMany({
    ...controversialPosts,
    where: (post, filter) => {
      const { sql, exists, and, eq } = filter;

      return and(
        exists(
          db
            .select()
            .from(users)
            .where(
              and(
                eq(users.id, post.authorId),
                eq(users.name, sql.placeholder("username")),
              ),
            ),
        ),
        controversialPosts.where(post, filter),
      );
    },
  })
  .prepare("user_controversial_posts");
