import db from "@/db";
import { usersToCommunities } from "@/db/schema/communities";
import { PostSort } from "@/types/enums";
import { PostsQueryConfig, postsQueryConfig } from "@/utils/postsQueryConfig";

const whereConfig: PostsQueryConfig["where"] = (post, filter) => {
  const { sql, exists, and, eq } = filter;

  return exists(
    db
      .select()
      .from(usersToCommunities)
      .where(
        and(
          eq(usersToCommunities.userId, sql.placeholder("currentUserId")),
          eq(usersToCommunities.communityId, post.communityId),
          eq(usersToCommunities.joined, true),
        ),
      ),
  );
};

const homePosts = (postSort: PostSort) =>
  postsQueryConfig({
    postSort,
    hideHiddenPosts: true,
    hideMutedCommunityPosts: true,
  });

export const getHomeBestPosts = db.query.posts
  .findMany({
    ...homePosts(PostSort.BEST),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        homePosts(PostSort.BEST).where(post, filter),
      ),
  })

  .prepare("home_best_posts");

export const getHomeHotPosts = db.query.posts
  .findMany({
    ...homePosts(PostSort.HOT),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        homePosts(PostSort.HOT).where(post, filter),
      ),
  })
  .prepare("home_hot_posts");

export const getHomeNewPosts = db.query.posts
  .findMany({
    ...homePosts(PostSort.NEW),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        homePosts(PostSort.NEW).where(post, filter),
      ),
  })

  .prepare("home_new_posts");

export const getHomeControversialPosts = db.query.posts
  .findMany({
    ...homePosts(PostSort.CONTROVERSIAL),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        homePosts(PostSort.CONTROVERSIAL).where(post, filter),
      ),
  })
  .prepare("home_controversial_posts");
