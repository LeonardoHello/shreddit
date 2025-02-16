import { UserToComment } from "@/db/schema/comments";
import db from "../db";

export const getComments = db.query.comments
  .findMany({
    where: (comment, { sql, eq }) =>
      eq(comment.postId, sql.placeholder("postId")),
    with: {
      author: true,
      post: { columns: { authorId: true } },
    },
    extras: (comment, { sql }) => ({
      voteCount: sql<number>`
        (
          SELECT COALESCE(SUM(
            CASE 
              WHEN vote_status = 'upvoted' THEN 1
              WHEN vote_status = 'downvoted' THEN -1
              ELSE 0
            END
          ), 0)
          FROM users_to_comments
          WHERE users_to_comments.comment_id = ${comment.id}
        )
      `.as("vote_count"),
      voteStatus: sql<UserToComment["voteStatus"] | null>`
      (
        SELECT vote_status
        FROM users_to_comments
        WHERE users_to_comments.comment_id = ${comment.id}
          AND users_to_comments.user_id = ${sql.placeholder("currentUserId")}
      )
    `.as("vote_status"),
    }),
    orderBy: (post, { desc }) => desc(post.createdAt),
  })
  .prepare("comments");
