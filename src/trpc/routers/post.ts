import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import {
  postFiles,
  PostFileSchema,
  posts,
  PostSchema,
  usersToPosts,
  UserToPost,
  UserToPostSchema,
} from "@/db/schema/posts";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";

export const postRouter = createTRPCRouter({
  getPost: baseProcedure
    .input(PostSchema.shape.id)
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: (post, { eq }) => eq(post.id, input),
        with: {
          community: { columns: { name: true, icon: true } },
          author: { columns: { username: true, imageUrl: true } },
          files: {
            columns: { id: true, name: true, url: true, thumbHash: true },
          },
        },
        extras: (post, { sql }) => ({
          voteCount: sql<number>`
            (
              SELECT COALESCE(SUM(
                CASE 
                  WHEN vote_status = 'upvoted' THEN 1
                  WHEN vote_status = 'downvoted' THEN -1
                  ELSE 0
                END
              ), 0)
              FROM users_to_posts
              WHERE users_to_posts.post_id = ${post.id}
            )
          `.as("vote_count"),
          commentCount: sql<number>`
            (
              SELECT COUNT(*)
              FROM comments
              WHERE comments.post_id = ${post.id}
            )
          `.as("comment_count"),
          isSaved: sql<UserToPost["saved"] | null>`
            (
              SELECT saved
              FROM users_to_posts
              WHERE users_to_posts.post_id = ${post.id}
                AND users_to_posts.user_id = ${ctx.userId}
            )
          `.as("is_saved"),
          isHidden: sql<UserToPost["hidden"] | null>`
            (
              SELECT hidden
              FROM users_to_posts
              WHERE users_to_posts.post_id = ${post.id}
                AND users_to_posts.user_id = ${ctx.userId}
            )
          `.as("is_hidden"),
          voteStatus: sql<UserToPost["voteStatus"] | null>`
            (
              SELECT vote_status
              FROM users_to_posts
              WHERE users_to_posts.post_id = ${post.id}
                AND users_to_posts.user_id = ${ctx.userId}
            )
          `.as("vote_status"),
          userToPostUpdatedAt: sql<UserToPost["updatedAt"] | null>`
            (
              SELECT updated_at
              FROM users_to_posts
              WHERE users_to_posts.post_id = ${post.id}
                AND users_to_posts.user_id = ${ctx.userId}
            )
          `.as("user_to_post_updated_at"),
        }),
      });

      if (!post)
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "The post you are looking for doesn't exist or has been deleted by the author.",
        });

      return post;
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
          files: PostFileSchema.pick({
            key: true,
            url: true,
            name: true,
            thumbHash: true,
          }).array(),
        }),
      ),
    )
    .mutation(({ input, ctx }) => {
      const { files, ...post } = input;

      const postId = uuidv4();

      return ctx.db.batch([
        ctx.db
          .insert(posts)
          .values({ ...post, text: null, id: postId, authorId: ctx.userId })
          .returning({ id: posts.id }),
        ctx.db
          .insert(postFiles)
          .values(files.map((file) => ({ ...file, postId }))),
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
        .set({ ...input })
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
