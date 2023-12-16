import { sql } from "drizzle-orm";

import db from "@/lib/db";
import { comments, usersToPosts } from "@/lib/db/schema";

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
