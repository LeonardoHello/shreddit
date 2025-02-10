import db from "@/db";
import { users } from "@/db/schema/users";
import { PostSort } from "@/types/enums";
import { postsQueryConfig, PostsQueryConfig } from "@/utils/postsQueryConfig";

const whereConfig: PostsQueryConfig["where"] = (post, filter) => {
  const { sql, eq, exists, and } = filter;

  return exists(
    db
      .select()
      .from(users)
      .where(
        and(
          eq(users.id, post.authorId),
          eq(users.username, sql.placeholder("username")),
        ),
      ),
  );
};

export const getUserBestPosts = db.query.posts
  .findMany({
    ...postsQueryConfig({ postSort: PostSort.BEST }),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        postsQueryConfig({ postSort: PostSort.BEST }).where(post, filter),
      ),
  })

  .prepare("user_best_posts");

export const getUserHotPosts = db.query.posts
  .findMany({
    ...postsQueryConfig({ postSort: PostSort.HOT }),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        postsQueryConfig({ postSort: PostSort.HOT }).where(post, filter),
      ),
  })
  .prepare("user_hot_posts");

export const getUserNewPosts = db.query.posts
  .findMany({
    ...postsQueryConfig({ postSort: PostSort.NEW }),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        postsQueryConfig({ postSort: PostSort.NEW }).where(post, filter),
      ),
  })
  .prepare("user_new_posts");

export const getUserControversialPosts = db.query.posts
  .findMany({
    ...postsQueryConfig({ postSort: PostSort.CONTROVERSIAL }),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        postsQueryConfig({ postSort: PostSort.CONTROVERSIAL }).where(
          post,
          filter,
        ),
      ),
  })
  .prepare("user_controversial_posts");
