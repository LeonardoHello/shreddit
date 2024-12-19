import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { getComment } from "@/api/getComment";
import {
  getFavoriteCommunities,
  getJoinedCommunities,
  getModeratedCommunities,
} from "@/api/getCommunities";
import { getCommunityImage, getUserToCommunity } from "@/api/getCommunity";
import { getPostById } from "@/api/getPost";
import {
  getAllBestPosts,
  getAllControversialPosts,
  getAllHotPosts,
  getAllNewPosts,
} from "@/api/getPosts/getAllPosts";
import {
  getCommunityBestPosts,
  getCommunityControversialPosts,
  getCommunityHotPosts,
  getCommunityNewPosts,
} from "@/api/getPosts/getCommunityPosts";
import {
  getHomeBestPosts,
  getHomeControversialPosts,
  getHomeHotPosts,
  getHomeNewPosts,
} from "@/api/getPosts/getHomePosts";
import { getUserImage } from "@/api/getUser";
import { searchCommunities, searchUsers } from "@/api/search";
import {
  comments,
  CommentSchema,
  communities,
  CommunitySchema,
  files,
  FileSchema,
  posts,
  PostSchema,
  UserSchema,
  usersToComments,
  usersToCommunities,
  usersToPosts,
  UserToCommentSchema,
  UserToCommunitySchema,
  UserToPostSchema,
} from "@/db/schema";
import { SortPosts } from "@/types";
import getUserPosts from "@/utils/getUserPosts";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  infiniteQueryPosts: createTRPCRouter({
    getHomePosts: protectedProcedure
      .input(
        z.object({
          // cursor input needed to expose useInfiniteQuery hook
          // value of the cursor is what's returned from getNextPageParam
          cursor: z.number().nullish(),
          sort: z.nativeEnum(SortPosts),
        }),
      )
      .query(async ({ input, ctx }) => {
        let posts;
        switch (input.sort) {
          case SortPosts.HOT:
            posts = await getHomeHotPosts.execute({
              offset: input.cursor,
              currentUserId: ctx.userId,
            });
            break;

          case SortPosts.NEW:
            posts = await getHomeNewPosts.execute({
              offset: input.cursor,
              currentUserId: ctx.userId,
            });
            break;

          case SortPosts.CONTROVERSIAL:
            posts = await getHomeControversialPosts.execute({
              offset: input.cursor,
              currentUserId: ctx.userId,
            });
            break;

          default:
            posts = await getHomeBestPosts.execute({
              offset: input.cursor,
              currentUserId: ctx.userId,
            });
            break;
        }

        let nextCursor: typeof input.cursor = undefined;
        if (posts.length === 10) {
          nextCursor = input.cursor! + 10;
        }

        return { posts, nextCursor };
      }),
    getAllPosts: baseProcedure
      .input(
        z.object({
          cursor: z.number().nullish(),
          sort: z.union([z.string(), z.array(z.string()), z.undefined()]),
        }),
      )
      .query(async ({ input }) => {
        let posts;
        switch (input.sort) {
          case SortPosts.HOT:
            posts = await getAllHotPosts.execute({
              offset: input.cursor,
            });
            break;

          case SortPosts.NEW:
            posts = await getAllNewPosts.execute({
              offset: input.cursor,
            });
            break;

          case SortPosts.CONTROVERSIAL:
            posts = await getAllControversialPosts.execute({
              offset: input.cursor,
            });
            break;

          default:
            posts = await getAllBestPosts.execute({
              offset: input.cursor,
            });
            break;
        }

        let nextCursor: typeof input.cursor = null;
        if (posts.length === 10) {
          nextCursor = input.cursor! + 10;
        }

        return { posts, nextCursor };
      }),

    getCommunityPosts: baseProcedure
      .input(
        z.object({
          cursor: z.number().nullish(),
          communityName: z.string(),
          sort: z.union([z.string(), z.array(z.string()), z.undefined()]),
        }),
      )
      .query(async ({ input: { cursor, sort, communityName } }) => {
        let posts;
        switch (sort) {
          case SortPosts.HOT:
            posts = await getCommunityHotPosts.execute({
              offset: cursor,
              communityName,
            });
            break;

          case SortPosts.NEW:
            posts = await getCommunityNewPosts.execute({
              offset: cursor,
              communityName,
            });
            break;

          case SortPosts.CONTROVERSIAL:
            posts = await getCommunityControversialPosts.execute({
              offset: cursor,
              communityName,
            });
            break;

          default:
            posts = await getCommunityBestPosts.execute({
              offset: cursor,
              communityName,
            });
            break;
        }

        let nextCursor: typeof cursor = null;
        if (posts.length === 10) {
          nextCursor = cursor! + 10;
        }

        return { posts, nextCursor };
      }),
    getUserPosts: baseProcedure
      .input(
        z.object({
          cursor: z.number().nullish(),
          userId: UserSchema.shape.id,
          userName: UserSchema.shape.name,
          filter: z.union([z.string(), z.array(z.string()), z.undefined()]),
          sort: z.union([z.string(), z.array(z.string()), z.undefined()]),
        }),
      )
      .query(async ({ input }) => {
        const posts = await getUserPosts(input);

        let nextCursor: typeof input.cursor = null;
        if (posts.length === 10) {
          nextCursor = input.cursor! + 10;
        }

        return { posts, nextCursor };
      }),
  }),
  getPost: baseProcedure.input(PostSchema.shape.id).query(async ({ input }) => {
    const post = await getPostById.execute({ postId: input });
    return post ?? null;
  }),
  searchUsers: baseProcedure.input(z.string()).query(({ input }) => {
    return searchUsers.execute({ search: `%${input}%` });
  }),
  searchCommunities: baseProcedure.input(z.string()).query(({ input }) => {
    return searchCommunities.execute({ search: `%${input}%` });
  }),
  getUserImage: protectedProcedure
    .input(UserSchema.shape.name)
    .query(({ input }) => {
      return getUserImage.execute({ name: input });
    }),
  getCommunityImage: protectedProcedure
    .input(CommunitySchema.shape.name)
    .query(({ input }) => {
      return getCommunityImage.execute({ name: input });
    }),
  getFavoriteCommunities: protectedProcedure.query(({ ctx }) => {
    return getFavoriteCommunities.execute({ currentUserId: ctx.userId });
  }),
  getModeratedCommunities: protectedProcedure.query(({ ctx }) => {
    return getModeratedCommunities.execute({ currentUserId: ctx.userId });
  }),
  getJoinedCommunities: protectedProcedure.query(({ ctx }) => {
    return getJoinedCommunities.execute({ currentUserId: ctx.userId });
  }),
  setAboutCommunity: protectedProcedure
    .input(CommunitySchema.pick({ id: true, about: true }))
    .mutation(({ input, ctx }) => {
      return ctx.db
        .update(communities)
        .set({ about: input.about })
        .where(eq(communities.id, input.id));
    }),
  deleteCommunity: protectedProcedure
    .input(CommunitySchema.shape.id)
    .mutation(({ input, ctx }) => {
      return ctx.db
        .delete(communities)
        .where(eq(communities.id, input))
        .returning({ name: communities.name });
    }),
  getUserToCommunity: baseProcedure
    .input(UserToCommunitySchema.shape.communityId)
    .query(({ input, ctx }) => {
      return getUserToCommunity.execute({
        userId: ctx.userId,
        communityId: input,
      });
    }),
  setFavoriteCommunity: protectedProcedure
    .input(
      UserToCommunitySchema.pick({
        communityId: true,
        favorite: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(usersToCommunities)
        .values({
          favorite: input.favorite,
          communityId: input.communityId,
          userId: ctx.userId,
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { favorite: input.favorite },
        });
    }),
  joinCommunity: protectedProcedure
    .input(
      UserToCommunitySchema.pick({
        communityId: true,
        member: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(usersToCommunities)
        .values({
          member: input.member,
          communityId: input.communityId,
          userId: ctx.userId,
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { member: input.member },
        })
        .returning({ member: usersToCommunities.member });
    }),
  muteCommunity: protectedProcedure
    .input(
      UserToCommunitySchema.pick({
        communityId: true,
        muted: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(usersToCommunities)
        .values({
          muted: input.muted,
          communityId: input.communityId,
          userId: ctx.userId,
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { muted: input.muted },
        })
        .returning({ muted: usersToCommunities.muted });
    }),
  createPost: protectedProcedure
    .input(
      z.object({
        post: PostSchema.omit({
          createdAt: true,
          updatedAt: true,
          authorId: true,
        }),
        files: FileSchema.omit({ id: true, postId: true }).array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.files.length === 0) {
        const postId = await ctx.db
          .insert(posts)
          .values({ ...input.post, authorId: ctx.userId })
          .returning({ id: posts.id });

        return [postId];
      }

      return ctx.db.batch([
        ctx.db
          .insert(posts)
          .values({ ...input.post, authorId: ctx.userId })
          .returning({ id: posts.id }),
        ctx.db
          .insert(files)
          .values(
            input.files.map((file) => ({ ...file, postId: input.post.id })),
          ),
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
        .returning({ saved: usersToPosts.saved });
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
  setPostSpoilerTag: protectedProcedure
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
  setPostNSFWTag: protectedProcedure
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
  getComment: baseProcedure
    .input(CommentSchema.shape.id)
    .query(async ({ input }) => {
      const comment = await getComment.execute({ commentId: input });
      return comment ?? null;
    }),
  deleteComment: protectedProcedure
    .input(CommentSchema.shape.id)
    .mutation(({ input, ctx }) => {
      return ctx.db
        .delete(comments)
        .where(eq(comments.id, input))
        .returning({ id: comments.id });
    }),
  createCommunity: protectedProcedure
    .input(
      CommunitySchema.shape.name
        .min(3, {
          message: "Community names must contain at least 3 characters.",
        })
        .max(21, {
          message: "Community names must contain at most 21 characters.",
        })
        .regex(/^[a-zA-Z0-9_]+$/, {
          message:
            "Community names can only contain letters, numbers, or underscores.",
        }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(communities)
        .values({
          moderatorId: ctx.userId,
          name: input,
        })
        .returning();
    }),
  createFile: protectedProcedure
    .input(FileSchema.omit({ id: true }).array())
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(files)
        .values(input)
        .onConflictDoNothing()
        .returning();
    }),
  deleteFile: protectedProcedure
    .input(
      z.object({
        keys: FileSchema.shape.key.array(),
        postId: FileSchema.shape.postId,
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .delete(files)
        .where(
          and(eq(files.postId, input.postId), inArray(files.key, input.keys)),
        )
        .returning();
    }),
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
