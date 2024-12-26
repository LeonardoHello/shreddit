import db from "@/db";
import { communities } from "@/db/schema";
import {
  bestPosts,
  controversialPosts,
  hotPosts,
  newPosts,
} from "@/utils/postsQueryConfig";

export const getCommunityBestPosts = db.query.posts
  .findMany({
    ...bestPosts,
    where: (post, filter) => {
      const { and, exists, eq, sql } = filter;

      return and(
        exists(
          db
            .select()
            .from(communities)
            .where(
              and(
                eq(communities.id, post.communityId),
                eq(communities.name, sql.placeholder("communityName")),
              ),
            ),
        ),
        bestPosts.where(post, filter),
      );
    },
  })
  .prepare("community_best_posts");

export const getCommunityHotPosts = db.query.posts
  .findMany({
    ...hotPosts,
    where: (post, filter) => {
      const { and, exists, eq, sql } = filter;

      return and(
        exists(
          db
            .select()
            .from(communities)
            .where(
              and(
                eq(communities.id, post.communityId),
                eq(communities.name, sql.placeholder("communityName")),
              ),
            ),
        ),
        hotPosts.where(post, filter),
      );
    },
  })
  .prepare("community_hot_posts");

export const getCommunityNewPosts = db.query.posts
  .findMany({
    ...newPosts,
    where: (post, filter) => {
      const { exists, and, eq, sql } = filter;
      return and(
        exists(
          db
            .select()
            .from(communities)
            .where(
              and(
                eq(communities.id, post.communityId),
                eq(communities.name, sql.placeholder("communityName")),
              ),
            ),
        ),
        newPosts.where(post, filter),
      );
    },
  })
  .prepare("community_new_posts");

export const getCommunityControversialPosts = db.query.posts
  .findMany({
    ...controversialPosts,
    where: (post, filter) => {
      const { exists, and, eq, sql } = filter;

      return and(
        exists(
          db
            .select()
            .from(communities)
            .where(
              and(
                eq(communities.id, post.communityId),
                eq(communities.name, sql.placeholder("communityName")),
              ),
            ),
        ),
        controversialPosts.where(post, filter),
      );
    },
  })
  .prepare("community_controversial_posts");
