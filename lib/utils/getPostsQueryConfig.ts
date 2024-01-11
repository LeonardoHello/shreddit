import { sql } from "drizzle-orm";
import { DBQueryConfig, ExtractTablesWithRelations } from "drizzle-orm";

import type * as schema from "../db/schema";
import { comments, usersToPosts } from "../db/schema";

export type PostsQueryConfig = DBQueryConfig<
  "many",
  true,
  ExtractTablesWithRelations<typeof schema>,
  ExtractTablesWithRelations<typeof schema>["posts"]
>;

export const postQueryWithConfig = {
  usersToPosts: { columns: { postId: false, createdAt: false } },
  community: { columns: { name: true, imageUrl: true } },
  author: { columns: { name: true } },
  comments: {
    columns: { id: true, text: true, parentCommentId: true },
    with: { author: true, usersToComments: true },
  },
  files: true,
} as const;

export const postsQueryConfig: PostsQueryConfig = {
  limit: 10,
  offset: sql.placeholder("offset"),
};

export const topPostsQueryConfig: PostsQueryConfig = {
  ...postsQueryConfig,
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
  }),
};

export const controversialPostsQueryConfig: PostsQueryConfig = {
  ...postsQueryConfig,
  extras: (post, { sql }) => ({
    commentCount: sql<number>`
				 (
					 SELECT COUNT(*)
					 FROM ${comments}
					 WHERE ${comments}.post_id = ${post.id}
				 )
			 `.as("comment_count"),
  }),
};
