import db from "@/db";
import { users } from "@/db/schema";
import {
  bestPostsQueryConfig,
  controversialPostsQueryConfig,
  hotPostsQueryConfig,
  newPostsQueryConfig,
  PostsQueryConfig,
} from "@/utils/postsQueryConfig";

const userPostsFilter = {
  hideHidden: false,
  hideCommunityMuted: false,
};

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
    ...bestPostsQueryConfig(userPostsFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        bestPostsQueryConfig(userPostsFilter).where(post, filter),
      ),
  })
  .prepare("user_best_posts");

export const getUserHotPosts = db.query.posts
  .findMany({
    ...hotPostsQueryConfig(userPostsFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        hotPostsQueryConfig(userPostsFilter).where(post, filter),
      ),
  })
  .prepare("user_hot_posts");

export const getUserNewPosts = db.query.posts
  .findMany({
    ...newPostsQueryConfig(userPostsFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        newPostsQueryConfig(userPostsFilter).where(post, filter),
      ),
  })
  .prepare("user_new_posts");

export const getUserControversialPosts = db.query.posts
  .findMany({
    ...controversialPostsQueryConfig(userPostsFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        controversialPostsQueryConfig(userPostsFilter).where(post, filter),
      ),
  })
  .prepare("user_controversial_posts");
