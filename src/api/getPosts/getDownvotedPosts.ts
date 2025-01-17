import db from "@/db";
import { usersToPosts } from "@/db/schema";
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
      .where(
        and(
          eq(usersToPosts.postId, post.id),
          eq(usersToPosts.userId, sql.placeholder("currentUserId")),
          eq(usersToPosts.voteStatus, "downvoted"),
        ),
      ),
  );
};

export const getDownvotedBestPosts = db.query.posts
  .findMany({
    ...bestPostsQueryConfig(hideFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        bestPostsQueryConfig(hideFilter).where(post, filter),
      ),
  })
  .prepare("downvoted_best_posts");

export const getDownvotedHotPosts = db.query.posts
  .findMany({
    ...hotPostsQueryConfig(hideFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        hotPostsQueryConfig(hideFilter).where(post, filter),
      ),
  })
  .prepare("downvoted_hot_posts");

export const getDownvotedNewPosts = db.query.posts
  .findMany({
    ...newPostsQueryConfig(hideFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        newPostsQueryConfig(hideFilter).where(post, filter),
      ),
  })
  .prepare("downvoted_new_posts");

export const getDownvotedControversialPosts = db.query.posts
  .findMany({
    ...controversialPostsQueryConfig(hideFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        controversialPostsQueryConfig(hideFilter).where(post, filter),
      ),
  })
  .prepare("downvoted_controversial_posts");
