import { eq } from "drizzle-orm";

import {
  comments,
  CommentSchema,
  usersToComments,
  UserToComment,
  UserToCommentSchema,
} from "@/db/schema/comments";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";

export const commentRouter = createTRPCRouter({
  getComments: baseProcedure
    .input(CommentSchema.shape.postId)
    .query(({ input, ctx }) => {
      return ctx.db.query.comments.findMany({
        where: (comment, { eq }) => eq(comment.postId, input),
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
                AND users_to_comments.user_id = ${ctx.userId}
            )
          `.as("vote_status"),
        }),
        orderBy: (post, { desc }) => desc(post.createdAt),
      });
    }),
  createComment: protectedProcedure
    .input(
      CommentSchema.pick({ postId: true, parentCommentId: true, text: true }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(comments)
        .values({
          authorId: ctx.userId,
          ...input,
        })
        .onConflictDoUpdate({
          target: [comments.id],
          set: { text: input.text, updatedAt: new Date() },
        })
        .returning();
    }),
  editComment: protectedProcedure
    .input(CommentSchema.pick({ id: true, text: true }))
    .mutation(({ input, ctx }) => {
      return ctx.db
        .update(comments)
        .set({ text: input.text, updatedAt: new Date() })
        .where(eq(comments.id, input.id))
        .returning();
    }),
  voteComment: protectedProcedure
    .input(UserToCommentSchema.pick({ commentId: true, voteStatus: true }))
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(usersToComments)
        .values({ userId: ctx.userId, ...input })
        .onConflictDoUpdate({
          target: [usersToComments.userId, usersToComments.commentId],
          set: { voteStatus: input.voteStatus },
        });
    }),
  deleteComment: protectedProcedure
    .input(CommentSchema.shape.id)
    .mutation(({ input, ctx }) => {
      return ctx.db
        .delete(comments)
        .where(eq(comments.id, input))
        .returning({ id: comments.id });
    }),
});
