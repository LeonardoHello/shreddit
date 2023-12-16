import { sql } from "drizzle-orm";

import db from "@/lib/db";
import { comments, users, usersToPosts } from "@/lib/db/schema";

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
