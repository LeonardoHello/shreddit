import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { getPostById } from "@/api/getPost";
import {
  files,
  FileSchema,
  posts,
  PostSchema,
  usersToPosts,
  UserToPostSchema,
} from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";

export const postRouter = createTRPCRouter({
  getPost: baseProcedure.input(PostSchema.shape.id).query(async ({ input }) => {
    const post = await getPostById.execute({ postId: input });
    return post ?? null;
  }),
  createTextPost: protectedProcedure
    .input(
      PostSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(posts)
        .values({ ...input, authorId: ctx.userId })
        .returning({ id: posts.id });
    }),
  createImagePost: protectedProcedure
    .input(
      PostSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
      }).and(
        z.object({
          files: FileSchema.omit({ id: true, postId: true }).array(),
        }),
      ),
    )
    .mutation(({ input, ctx }) => {
      const { files: postFiles, ...post } = input;

      const postId = uuidv4();

      return ctx.db.batch([
        ctx.db
          .insert(posts)
          .values({ ...post, text: null, id: postId, authorId: ctx.userId })
          .returning({ id: posts.id }),
        ctx.db
          .insert(files)
          .values(postFiles.map((file) => ({ ...file, postId }))),
      ]);
    }),
  editPost: protectedProcedure
    .input(
      PostSchema.pick({
        id: true,
        text: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .update(posts)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(posts.id, input.id))
        .returning();
    }),
  deletePost: protectedProcedure
    .input(PostSchema.shape.id)
    .mutation(({ input, ctx }) => {
      return ctx.db
        .delete(posts)
        .where(eq(posts.id, input))
        .returning({ id: posts.id });
    }),
  savePost: protectedProcedure
    .input(
      UserToPostSchema.pick({
        postId: true,
        saved: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(usersToPosts)
        .values({ ...input, userId: ctx.userId })
        .onConflictDoUpdate({
          target: [usersToPosts.userId, usersToPosts.postId],
          set: { saved: input.saved },
        })
        .returning({ saved: usersToPosts.saved });
    }),
  hidePost: protectedProcedure
    .input(
      UserToPostSchema.pick({
        postId: true,
        hidden: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(usersToPosts)
        .values({ ...input, userId: ctx.userId })
        .onConflictDoUpdate({
          target: [usersToPosts.userId, usersToPosts.postId],
          set: { hidden: input.hidden },
        })
        .returning({ hidden: usersToPosts.hidden });
    }),
  votePost: protectedProcedure
    .input(UserToPostSchema.pick({ postId: true, voteStatus: true }))
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(usersToPosts)
        .values({ ...input, userId: ctx.userId })
        .onConflictDoUpdate({
          target: [usersToPosts.userId, usersToPosts.postId],
          set: { voteStatus: input.voteStatus },
        })
        .returning();
    }),
  setPostSpoiler: protectedProcedure
    .input(
      PostSchema.pick({
        id: true,
        spoiler: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .update(posts)
        .set({ spoiler: input.spoiler, updatedAt: new Date() })
        .where(and(eq(posts.authorId, ctx.userId), eq(posts.id, input.id)))
        .returning({ spoiler: posts.spoiler });
    }),
  setPostNSFW: protectedProcedure
    .input(
      PostSchema.pick({
        id: true,
        nsfw: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .update(posts)
        .set({ nsfw: input.nsfw, updatedAt: new Date() })
        .where(and(eq(posts.authorId, ctx.userId), eq(posts.id, input.id)))
        .returning({ nsfw: posts.nsfw });
    }),
});
