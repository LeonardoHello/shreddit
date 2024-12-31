import { eq } from "drizzle-orm";

import {
  comments,
  CommentSchema,
  usersToComments,
  UserToCommentSchema,
} from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "../init";

export const commentRouter = createTRPCRouter({
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
