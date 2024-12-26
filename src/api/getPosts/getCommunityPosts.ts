import db from "@/db";
import { communities } from "@/db/schema";
import { PostSort } from "@/types";
import { monthAgo } from "@/utils/getLastMonthDate";
import { postQueryConfig } from "@/utils/getPostsQueryConfig";

export const getCommunityBestPosts = db.query.posts
  .findMany({
    ...postQueryConfig(),
    where: (post, { exists, and, eq, sql }) =>
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
  })
  .prepare("get_community_best_posts");

export const getCommunityHotPosts = db.query.posts
  .findMany({
    ...postQueryConfig(PostSort.HOT),
    where: (post, { sql, exists, and, eq, gt }) =>
      and(
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
        gt(post.createdAt, monthAgo),
      ),
  })
  .prepare("get_community_hot_posts");

export const getCommunityNewPosts = db.query.posts
  .findMany({
    ...postQueryConfig(PostSort.NEW),
    where: (post, { exists, and, eq, sql }) =>
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
  })
  .prepare("get_community_new_posts");

export const getCommunityControversialPosts = db.query.posts
  .findMany({
    ...postQueryConfig(PostSort.CONTROVERSIAL),
    where: (post, { exists, and, eq, sql }) =>
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
  })
  .prepare("get_community_controversial_posts");
