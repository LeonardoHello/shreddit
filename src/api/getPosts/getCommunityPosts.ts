import db from "@/db";
import { communities } from "@/db/schema";
import {
  bestPostsQueryConfig,
  controversialPostsQueryConfig,
  hotPostsQueryConfig,
  newPostsQueryConfig,
  PostsQueryConfig,
} from "@/utils/postsQueryConfig";

const hideFilter = {
  hideHidden: true,
  hideCommunityMuted: false,
};

const whereConfig: PostsQueryConfig["where"] = (post, filter) => {
  const { sql, exists, and, eq } = filter;
  return exists(
    db
      .select()
      .from(communities)
      .where(
        and(
          eq(communities.id, post.communityId),
          eq(communities.name, sql.placeholder("communityName")),
        ),
      ),
  );
};

export const getCommunityBestPosts = db.query.posts
  .findMany({
    ...bestPostsQueryConfig(hideFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        bestPostsQueryConfig(hideFilter).where(post, filter),
      ),
  })
  .prepare("community_best_posts");

export const getCommunityHotPosts = db.query.posts
  .findMany({
    ...hotPostsQueryConfig(hideFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        hotPostsQueryConfig(hideFilter).where(post, filter),
      ),
  })
  .prepare("community_hot_posts");

export const getCommunityNewPosts = db.query.posts
  .findMany({
    ...newPostsQueryConfig(hideFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        newPostsQueryConfig(hideFilter).where(post, filter),
      ),
  })
  .prepare("community_new_posts");

export const getCommunityControversialPosts = db.query.posts
  .findMany({
    ...controversialPostsQueryConfig(hideFilter),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        controversialPostsQueryConfig(hideFilter).where(post, filter),
      ),
  })
  .prepare("community_controversial_posts");
