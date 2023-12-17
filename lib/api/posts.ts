import { sql } from "drizzle-orm";

import db from "../db";
import {
  comments,
  communities,
  users,
  usersToCommunities,
  usersToPosts,
} from "../db/schema";

export const getAllBestPosts = db.query.posts
  .findMany({
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToCommunities)
          .where(
            and(
              eq(usersToCommunities.userId, sql.placeholder("userId")),
              eq(usersToCommunities.member, true),
              eq(usersToCommunities.userId, post.authorId),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return and(
        exists(
          db
            .select()
            .from(usersToCommunities)
            .where(
              and(
                eq(usersToCommunities.userId, sql.placeholder("userId")),
                eq(usersToCommunities.member, true),
                eq(usersToCommunities.userId, post.authorId),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToCommunities)
          .where(
            and(
              eq(usersToCommunities.userId, sql.placeholder("userId")),
              eq(usersToCommunities.member, true),
              eq(usersToCommunities.userId, post.authorId),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(usersToCommunities)
          .where(
            and(
              eq(usersToCommunities.userId, sql.placeholder("userId")),
              eq(usersToCommunities.member, true),
              eq(usersToCommunities.userId, post.authorId),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(users)
          .where(
            and(
              eq(users.id, post.authorId),
              eq(users.name, sql.placeholder("userName")),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
    where: (post, { sql, exists, and, eq, gt }) => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      return and(
        exists(
          db
            .select()
            .from(users)
            .where(
              and(
                eq(users.id, post.authorId),
                eq(users.name, sql.placeholder("userName")),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(users)
          .where(
            and(
              eq(users.id, post.authorId),
              eq(users.name, sql.placeholder("userName")),
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
    limit: 10,
    offset: sql.placeholder("offset"),
    extras: (post, { sql }) => ({
      voteCount: sql<number>`
				(
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'upvoted' 
				) - (
					SELECT COUNT(*) 
					FROM ${usersToPosts} 
					WHERE ${usersToPosts}.post_id = ${post.id} 
						AND ${usersToPosts}.vote_status = 'downvoted'
				)
			`.as("vote_count"),
      commentCount: sql<number>`
				(
					SELECT COUNT(*)
					FROM ${comments}
					WHERE ${comments}.post_id = ${post.id}
				)
			`.as("comment_count"),
    }),
    where: (post, { sql, exists, and, eq }) =>
      exists(
        db
          .select()
          .from(users)
          .where(
            and(
              eq(users.id, post.authorId),
              eq(users.name, sql.placeholder("userName")),
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
