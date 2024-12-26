import { DBQueryConfig, ExtractTablesWithRelations, sql } from "drizzle-orm";

import { PostSort } from "@/types";
import * as schema from "../db/schema";

export type PostsQueryConfig = DBQueryConfig<
  "many",
  true,
  ExtractTablesWithRelations<typeof schema>,
  ExtractTablesWithRelations<typeof schema>["posts"]
>;

export const postQueryConfig = (sort?: PostSort) =>
  ({
    limit: 10,
    offset: sql.placeholder("offset"),
    with: {
      usersToPosts: { columns: { postId: false, createdAt: false } },
      community: {
        columns: { name: true, imageUrl: true },
        with: {
          usersToCommunities: { columns: { muted: true, userId: true } },
        },
      },
      author: { columns: { name: true } },
      files: true,
    },
    extras: (post) => ({
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
    orderBy: (post, { desc, asc }) => {
      switch (sort) {
        case PostSort.HOT:
          return [desc(sql`vote_count`), asc(post.createdAt)];

        case PostSort.NEW:
          return [desc(post.createdAt)];

        case PostSort.CONTROVERSIAL:
          return [desc(sql`comment_count`), asc(post.createdAt)];

        default:
          return [desc(sql`vote_count`), asc(post.createdAt)];
      }
    },
  }) satisfies PostsQueryConfig;
