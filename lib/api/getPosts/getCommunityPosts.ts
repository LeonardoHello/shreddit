import db from "@/lib/db";
import { communities } from "@/lib/db/schema";
import postsQueryConfig from "@/lib/utils/getPostsBaseQueryConfig";

export const getCommunityBestPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: {
      usersToPosts: { columns: { postId: false, createdAt: false } },
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    where: (post, { sql, exists, and, eq }) =>
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
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_community_best_posts");

export const getCommunityHotPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: {
      usersToPosts: { columns: { postId: false, createdAt: false } },
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

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
        gt(post.createdAt, monthAgo),
      );
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_community_hot_posts");

export const getCommunityNewPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: {
      usersToPosts: { columns: { postId: false, createdAt: false } },
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
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
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_community_new_posts");

export const getCommunityControversialPosts = db.query.posts
  .findMany({
    ...postsQueryConfig,
    with: {
      usersToPosts: { columns: { postId: false, createdAt: false } },
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
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
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_community_controversial_posts");
