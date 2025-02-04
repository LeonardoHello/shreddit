import db from "@/db";
import { users, usersToPosts } from "@/db/schema";
import {
  bestPostsQueryConfig,
  controversialPostsQueryConfig,
  hotPostsQueryConfig,
  newPostsQueryConfig,
  PostsQueryConfig,
} from "@/utils/postsQueryConfig";

const hideFilter = {
  hideHidden: false,
  hideCommunityMuted: false,
};

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
        and(
          eq(usersToPosts.postId, post.id),
          eq(usersToPosts.voteStatus, "upvoted"),
        ),
      ),
  );
};

export const getUpvotedBestPosts = db.query.posts
  .findMany({
    ...bestPostsQueryConfig(hideFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        bestPostsQueryConfig(hideFilter).where(post, filter),
      ),
  })
  .prepare("upvoted_best_posts");

export const getUpvotedHotPosts = db.query.posts
  .findMany({
    ...hotPostsQueryConfig(hideFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        hotPostsQueryConfig(hideFilter).where(post, filter),
      ),
  })
  .prepare("upvoted_hot_posts");

export const getUpvotedNewPosts = db.query.posts
  .findMany({
    ...newPostsQueryConfig(hideFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        newPostsQueryConfig(hideFilter).where(post, filter),
      ),
  })
  .prepare("upvoted_new_posts");

export const getUpvotedControversialPosts = db.query.posts
  .findMany({
    ...controversialPostsQueryConfig(hideFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        controversialPostsQueryConfig(hideFilter).where(post, filter),
      ),
  })
  .prepare("upvoted_controversial_posts");
