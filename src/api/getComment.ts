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
  })
  .prepare("comment");

export const getComment = db.query.comments
  .findFirst({
    where: (comment, { sql, eq }) =>
      eq(comment.id, sql.placeholder("commentId")),
    with: {
      author: true,
      usersToComments: true,
      post: { columns: { authorId: true } },
    },
  })
  .prepare("comment");
