import {
  DBQueryConfig,
  ExtractTablesWithRelations,
  RelationTableAliasProxyHandler,
  sql,
} from "drizzle-orm";

import type * as schema from "../db/schema";

export type PostsQueryConfig = DBQueryConfig<
  "many",
  true,
  ExtractTablesWithRelations<typeof schema>,
  ExtractTablesWithRelations<typeof schema>["posts"]
>;

// const typesafePostQueryConfig: PostsQueryConfig = {
//   limit: 10,
//   offset: sql.placeholder("offset"),
//   with: {
//     usersToPosts: { columns: { postId: false, createdAt: false } },
//     community: {
//       columns: { name: true, imageUrl: true },
//       with: { usersToCommunities: { columns: { muted: true, userId: true } } },
//     },
//     author: { columns: { name: true } },
//     files: true,
//   },
//   extras: (post, { sql }) => ({
//     voteCount: sql<number>`
// 				 (
// 					 SELECT COUNT(*)
// 					 FROM users_to_posts
// 					 WHERE users_to_posts.post_id = ${post.id}
// 						 AND users_to_posts.vote_status = 'upvoted'
// 				 ) - (
// 					 SELECT COUNT(*)
// 					 FROM users_to_posts
// 					 WHERE users_to_posts.post_id = ${post.id}
// 						 AND users_to_posts.vote_status = 'downvoted'
// 				 )
// 			 `.as("vote_count"),
//     commentCount: sql<number>`
// 				 (
// 					 SELECT COUNT(*)
// 					 FROM comments
// 					 WHERE comments.post_id = ${post.id}
// 				 )
// 			 `.as("comment_count"),
//   }),
// };

export const postQueryConfig = {
  limit: 10,
  offset: sql.placeholder("offset"),
  with: {
    usersToPosts: { columns: { postId: false, createdAt: false } },
    community: {
      columns: { name: true, imageUrl: true },
      with: { usersToCommunities: { columns: { muted: true, userId: true } } },
    },
    author: { columns: { name: true } },
    files: true,
  },
  // @ts-expect-error
  extras: (post, { sql }) => ({
    voteCount: sql<number>`
				 (
					 SELECT COUNT(*) 
					 FROM users_to_posts 
					 WHERE users_to_posts.post_id = ${post.id} 
						 AND users_to_posts.vote_status = 'upvoted' 
				 ) - (
					 SELECT COUNT(*) 
					 FROM users_to_posts 
					 WHERE users_to_posts.post_id = ${post.id} 
						 AND users_to_posts.vote_status = 'downvoted'
				 )
			 `.as("vote_count"),
    commentCount: sql<number>`
				 (
					 SELECT COUNT(*)
					 FROM comments
					 WHERE comments.post_id = ${post.id}
				 )
			 `.as("comment_count"),
  }),
} as const;
