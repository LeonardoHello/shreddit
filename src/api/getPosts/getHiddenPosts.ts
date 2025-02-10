import db from "@/db";
import { usersToPosts } from "@/db/schema/posts";
import { users } from "@/db/schema/users";
import { PostSort } from "@/types/enums";
import { PostsQueryConfig, postsQueryConfig } from "@/utils/postsQueryConfig";

const whereConfig: PostsQueryConfig["where"] = (post, filter) => {
  const { sql, exists, and, eq } = filter;

  return exists(
    db
      .select()
      .from(usersToPosts)
      .innerJoin(
        users,
        and(
          eq(users.id, usersToPosts.userId),
          eq(users.username, sql.placeholder("username")),
        ),
      )
      .where(
        and(eq(usersToPosts.postId, post.id), eq(usersToPosts.hidden, true)),
      ),
  );
};

export const getHiddenBestPosts = db.query.posts
  .findMany({
    ...postsQueryConfig({ postSort: PostSort.BEST }),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        postsQueryConfig({ postSort: PostSort.BEST }).where(post, filter),
      ),
  })
  .prepare("hidden_best_posts");

export const getHiddenHotPosts = db.query.posts
  .findMany({
    ...postsQueryConfig({ postSort: PostSort.HOT }),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        postsQueryConfig({ postSort: PostSort.HOT }).where(post, filter),
      ),
  })
  .prepare("hidden_hot_posts");

export const getHiddenNewPosts = db.query.posts
  .findMany({
    ...postsQueryConfig({ postSort: PostSort.NEW }),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        postsQueryConfig({ postSort: PostSort.NEW }).where(post, filter),
      ),
  })

  .prepare("hidden_new_posts");

export const getHiddenControversialPosts = db.query.posts
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
  .prepare("hidden_controversial_posts");
