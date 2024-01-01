import db from "@/lib/db";
import { comments, usersToPosts } from "@/lib/db/schema";

export const getPost = db.query.posts
  .findFirst({
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
      usersToPosts: { columns: { postId: false, createdAt: false } },
      community: { columns: { name: true, imageUrl: true } },
      author: { columns: { name: true } },
      files: true,
    },
    where: (post, { sql, eq }) => eq(post.id, sql.placeholder("postId")),
  })
  .prepare("get_post");
