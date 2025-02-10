import db from "@/db";
import { communities } from "@/db/schema/communities";
import { PostSort } from "@/types/enums";
import { PostsQueryConfig, postsQueryConfig } from "@/utils/postsQueryConfig";

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

const communityPosts = (postSort: PostSort) => {
  return postsQueryConfig({
    postSort,
    hideHiddenPosts: true,
  });
};

export const getCommunityBestPosts = db.query.posts
  .findMany({
    ...communityPosts(PostSort.BEST),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        communityPosts(PostSort.BEST).where(post, filter),
      ),
  })
  .prepare("community_best_posts");

export const getCommunityHotPosts = db.query.posts
  .findMany({
    ...communityPosts(PostSort.HOT),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        communityPosts(PostSort.HOT).where(post, filter),
      ),
  })
  .prepare("community_hot_posts");

export const getCommunityNewPosts = db.query.posts
  .findMany({
    ...communityPosts(PostSort.NEW),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        communityPosts(PostSort.NEW).where(post, filter),
      ),
  })
  .prepare("community_new_posts");

export const getCommunityControversialPosts = db.query.posts
  .findMany({
    ...communityPosts(PostSort.CONTROVERSIAL),
    where: (post, filter) =>
      filter.and(
        whereConfig(post, filter),
        communityPosts(PostSort.CONTROVERSIAL).where(post, filter),
      ),
  })
  .prepare("community_controversial_posts");
