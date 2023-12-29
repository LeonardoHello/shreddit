import { sql } from "drizzle-orm";

import { comments, usersToPosts } from "../db/schema";
import { PostsQueryConfig } from "../types";

const postsQueryConfig: PostsQueryConfig = {
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
};

export default postsQueryConfig;
