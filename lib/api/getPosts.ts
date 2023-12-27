import {
  type DBQueryConfig,
  ExtractTablesWithRelations,
  sql,
} from "drizzle-orm";

import db from "../db";
import * as schema from "../db/schema";

type Relations = ExtractTablesWithRelations<typeof schema>;

const queryConfig: DBQueryConfig<"many", true, Relations, Relations["posts"]> =
  {
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${schema.usersToPosts} 
					WHERE ${schema.usersToPosts}.post_id = ${post.id} 
						AND ${schema.usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${schema.usersToPosts} 
					WHERE ${schema.usersToPosts}.post_id = ${post.id} 
						AND ${schema.usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${schema.comments}
					WHERE ${schema.comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
  };

export const getAllBestPosts = db.query.posts
  .findMany({
    ...queryConfig,
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_all_best_posts");

export const getAllHotPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return gt(post.createdAt, monthAgo);
    },
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_all_hot_posts");

export const getAllNewPosts = db.query.posts
  .findMany({
    ...queryConfig,
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_all_posts");

export const getAllControversialPosts = db.query.posts
  .findMany({
    ...queryConfig,
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_all_controversial_posts");

export const getCommunityBestPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.communities)
          .where(
            and(
              eq(schema.communities.id, post.communityId),
              eq(schema.communities.name, sql.placeholder("communityName")),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_community_best_posts");

export const getCommunityHotPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return and(
        exists(
          db
            .select()
            .from(schema.communities)
            .where(
              and(
                eq(schema.communities.id, post.communityId),
                eq(schema.communities.name, sql.placeholder("communityName")),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      );
    },
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_community_hot_posts");

export const getCommunityNewPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { exists, and, eq, sql }) =>
      exists(
        db
          .select()
          .from(schema.communities)
          .where(
            and(
              eq(schema.communities.id, post.communityId),
              eq(schema.communities.name, sql.placeholder("communityName")),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_community_new_posts");

export const getCommunityControversialPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { exists, and, eq, sql }) =>
      exists(
        db
          .select()
          .from(schema.communities)
          .where(
            and(
              eq(schema.communities.id, post.communityId),
              eq(schema.communities.name, sql.placeholder("communityName")),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_community_controversial_posts");

export const getHomeBestPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToCommunities)
          .where(
            and(
              eq(schema.usersToCommunities.userId, sql.placeholder("userId")),
              eq(schema.usersToCommunities.member, true),
              eq(schema.usersToCommunities.userId, post.authorId),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_home_best_posts");

export const getHomeHotPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return and(
        exists(
          db
            .select()
            .from(schema.usersToCommunities)
            .where(
              and(
                eq(schema.usersToCommunities.userId, sql.placeholder("userId")),
                eq(schema.usersToCommunities.member, true),
                eq(schema.usersToCommunities.userId, post.authorId),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      );
    },
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_home_hot_posts");

export const getHomeNewPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToCommunities)
          .where(
            and(
              eq(schema.usersToCommunities.userId, sql.placeholder("userId")),
              eq(schema.usersToCommunities.member, true),
              eq(schema.usersToCommunities.userId, post.authorId),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_home_new_posts");

export const getHomeControversialPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToCommunities)
          .where(
            and(
              eq(schema.usersToCommunities.userId, sql.placeholder("userId")),
              eq(schema.usersToCommunities.member, true),
              eq(schema.usersToCommunities.userId, post.authorId),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_home_controversial_posts");

export const getUserBestPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.users)
          .where(
            and(
              eq(schema.users.id, post.authorId),
              eq(schema.users.name, sql.placeholder("userName")),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_user_best_posts");

export const getUserHotPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return and(
        exists(
          db
            .select()
            .from(schema.users)
            .where(
              and(
                eq(schema.users.id, post.authorId),
                eq(schema.users.name, sql.placeholder("userName")),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      );
    },
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_user_hot_posts");

export const getUserNewPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.users)
          .where(
            and(
              eq(schema.users.id, post.authorId),
              eq(schema.users.name, sql.placeholder("userName")),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_user_new_posts");

export const getUserControversialPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.users)
          .where(
            and(
              eq(schema.users.id, post.authorId),
              eq(schema.users.name, sql.placeholder("userName")),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_user_controversial_posts");

export const getSavedBestPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToPosts)
          .where(
            and(
              eq(schema.usersToPosts.postId, post.id),
              eq(schema.usersToPosts.userId, sql.placeholder("userId")),
              eq(schema.usersToPosts.saved, true),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_saved_best_posts");

export const getSavedHotPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return and(
        exists(
          db
            .select()
            .from(schema.usersToPosts)
            .where(
              and(
                eq(schema.usersToPosts.postId, post.id),
                eq(schema.usersToPosts.userId, sql.placeholder("userId")),
                eq(schema.usersToPosts.saved, true),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      );
    },
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_saved_hot_posts");

export const getSavedNewPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToPosts)
          .where(
            and(
              eq(schema.usersToPosts.postId, post.id),
              eq(schema.usersToPosts.userId, sql.placeholder("userId")),
              eq(schema.usersToPosts.saved, true),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_saved_new_posts");

export const getSavedControversialPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToPosts)
          .where(
            and(
              eq(schema.usersToPosts.postId, post.id),
              eq(schema.usersToPosts.userId, sql.placeholder("userId")),
              eq(schema.usersToPosts.saved, true),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_saved_controversial_posts");

export const getHiddenBestPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToPosts)
          .where(
            and(
              eq(schema.usersToPosts.postId, post.id),
              eq(schema.usersToPosts.userId, sql.placeholder("userId")),
              eq(schema.usersToPosts.hidden, true),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_hidden_best_posts");

export const getHiddenHotPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return and(
        exists(
          db
            .select()
            .from(schema.usersToPosts)
            .where(
              and(
                eq(schema.usersToPosts.postId, post.id),
                eq(schema.usersToPosts.userId, sql.placeholder("userId")),
                eq(schema.usersToPosts.hidden, true),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      );
    },
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_hidden_hot_posts");

export const getHiddenNewPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToPosts)
          .where(
            and(
              eq(schema.usersToPosts.postId, post.id),
              eq(schema.usersToPosts.userId, sql.placeholder("userId")),
              eq(schema.usersToPosts.hidden, true),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_hidden_new_posts");

export const getHiddenControversialPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToPosts)
          .where(
            and(
              eq(schema.usersToPosts.postId, post.id),
              eq(schema.usersToPosts.userId, sql.placeholder("userId")),
              eq(schema.usersToPosts.hidden, true),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_hidden_controversial_posts");

export const getUpvotedBestPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToPosts)
          .where(
            and(
              eq(schema.usersToPosts.postId, post.id),
              eq(schema.usersToPosts.userId, sql.placeholder("userId")),
              eq(schema.usersToPosts.voteStatus, "upvoted"),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_upvoted_best_posts");

export const getUpvotedHotPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return and(
        exists(
          db
            .select()
            .from(schema.usersToPosts)
            .where(
              and(
                eq(schema.usersToPosts.postId, post.id),
                eq(schema.usersToPosts.userId, sql.placeholder("userId")),
                eq(schema.usersToPosts.voteStatus, "upvoted"),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      );
    },
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_upvoted_hot_posts");

export const getUpvotedNewPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToPosts)
          .where(
            and(
              eq(schema.usersToPosts.postId, post.id),
              eq(schema.usersToPosts.userId, sql.placeholder("userId")),
              eq(schema.usersToPosts.voteStatus, "upvoted"),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_upvoted_new_posts");

export const getUpvotedControversialPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToPosts)
          .where(
            and(
              eq(schema.usersToPosts.postId, post.id),
              eq(schema.usersToPosts.userId, sql.placeholder("userId")),
              eq(schema.usersToPosts.voteStatus, "upvoted"),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_upvoted_controversial_posts");

export const getDownvotedBestPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToPosts)
          .where(
            and(
              eq(schema.usersToPosts.postId, post.id),
              eq(schema.usersToPosts.userId, sql.placeholder("userId")),
              eq(schema.usersToPosts.voteStatus, "downvoted"),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_downvoted_best_posts");

export const getDownvotedHotPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return and(
        exists(
          db
            .select()
            .from(schema.usersToPosts)
            .where(
              and(
                eq(schema.usersToPosts.postId, post.id),
                eq(schema.usersToPosts.userId, sql.placeholder("userId")),
                eq(schema.usersToPosts.voteStatus, "downvoted"),
              ),
            ),
        ),
        gt(post.createdAt, monthAgo),
      );
    },
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`vote_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_downvoted_hot_posts");

export const getDownvotedNewPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToPosts)
          .where(
            and(
              eq(schema.usersToPosts.postId, post.id),
              eq(schema.usersToPosts.userId, sql.placeholder("userId")),
              eq(schema.usersToPosts.voteStatus, "downvoted"),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  })
  .prepare("get_downvoted_new_posts");

export const getDownvotedControversialPosts = db.query.posts
  .findMany({
    ...queryConfig,
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(schema.usersToPosts)
          .where(
            and(
              eq(schema.usersToPosts.postId, post.id),
              eq(schema.usersToPosts.userId, sql.placeholder("userId")),
              eq(schema.usersToPosts.voteStatus, "downvoted"),
            ),
          ),
      ),
    with: {
      usersToPosts: true,
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    orderBy: (post, { sql, asc, desc }) => [
      desc(sql`comment_count`),
      asc(post.createdAt),
    ],
  })
  .prepare("get_downvoted_controversial_posts");
