import db from "../db";
import { postQueryWithConfig } from "../utils/getPostsQueryConfig";

export const getComment = db.query.comments
  .findFirst({
    where: (comment, { sql, eq }) =>
      eq(comment.id, sql.placeholder("commentId")),
    with: postQueryWithConfig.comments.with,
  })
  .prepare("get_comment");
