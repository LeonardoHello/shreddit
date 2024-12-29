import db from "../db";

export const getComments = db.query.comments
  .findMany({
    where: (comment, { sql, eq }) =>
      eq(comment.postId, sql.placeholder("postId")),
    with: {
      author: true,
      usersToComments: true,
      post: { columns: { authorId: true } },
    },
    extras: (comment, { sql }) => ({
      voteCount: sql<number>`
        (
          SELECT COUNT(*)
          FROM users_to_comments
          WHERE users_to_comments.comment_id = ${comment.id}
            AND users_to_comments.vote_status = 'upvoted'
        ) - (
          SELECT COUNT(*)
          FROM users_to_comments
          WHERE users_to_comments.comment_id = ${comment.id}
            AND users_to_comments.vote_status = 'downvoted'
        )
      `.as("vote_count"),
    }),
    orderBy: (post, { desc }) => desc(post.createdAt),
  })
  .prepare("comments");
