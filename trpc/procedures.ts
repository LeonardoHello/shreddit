import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

import {
  getFavoriteCommunities,
  getJoinedCommunities,
  getModeratedCommunities,
} from "@/lib/api/communities";
import { setFavoriteCommunity } from "@/lib/api/community";
import { getCommunityImage, getUserImage } from "@/lib/api/image";
import {
  deletePost,
  downvotePost,
  setPostNSFWTag,
  setPostSpoilerTag,
  upvotePost,
} from "@/lib/api/post";
import {
  getAllBestPosts,
  getAllControversialPosts,
  getAllHotPosts,
  getAllNewPosts,
  getCommunityBestPosts,
  getCommunityControversialPosts,
  getCommunityHotPosts,
  getCommunityNewPosts,
  getHomeBestPosts,
  getHomeControversialPosts,
  getHomeHotPosts,
  getHomeNewPosts,
  getUserBestPosts,
  getUserControversialPosts,
  getUserHotPosts,
  getUserNewPosts,
} from "@/lib/api/posts";
import { searchCommunities, searchUsers } from "@/lib/api/search";
import {
  CommunitySchema,
  PostSchema,
  UserSchema,
  UserToCommunitySchema,
  UserToPostSchema,
} from "@/lib/db/schema";
import getInfiniteQueryCursor from "@/lib/utils/getInfiniteQueryCursor";

import { procedure, protectedProcedure, router } from ".";

export const appRouter = router({
  searchUsers: procedure.input(z.string()).query(({ input }) => {
    return searchUsers.execute({ search: `%${input}%` });
  }),
  searchCommunities: procedure.input(z.string()).query(({ input }) => {
    return searchCommunities.execute({ search: `%${input}%` });
  }),
  getAllBestPosts: procedure
    .input(
      z.object({
        // cursor input needed to expose useInfiniteQuery hook
        // value of the cursor is what's returned from getNextPageParam
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input: { cursor } }) => {
      const posts = await getAllBestPosts.execute({
        offset: cursor,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getAllHotPosts: procedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input: { cursor } }) => {
      const posts = await getAllHotPosts.execute({
        offset: cursor,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getAllNewPosts: procedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input: { cursor } }) => {
      const posts = await getAllNewPosts.execute({
        offset: cursor,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getAllControversialPosts: procedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input: { cursor } }) => {
      const posts = await getAllControversialPosts.execute({
        offset: cursor,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getHomeBestPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input: { cursor }, ctx }) => {
      const posts = await getHomeBestPosts.execute({
        userId: ctx.auth.userId,
        offset: cursor,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getHomeHotPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input: { cursor }, ctx }) => {
      const posts = await getHomeHotPosts.execute({
        userId: ctx.auth.userId,
        offset: cursor,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getHomeNewPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input: { cursor }, ctx }) => {
      const posts = await getHomeNewPosts.execute({
        userId: ctx.auth.userId,
        offset: cursor,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getHomeControversialPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input: { cursor }, ctx }) => {
      const posts = await getHomeControversialPosts.execute({
        userId: ctx.auth.userId,
        offset: cursor,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getUserBestPosts: procedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        userName: z.string(),
      }),
    )
    .query(async ({ input: { cursor, userName } }) => {
      const posts = await getUserBestPosts.execute({
        offset: cursor,
        userName,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getUserHotPosts: procedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        userName: z.string(),
      }),
    )
    .query(async ({ input: { cursor, userName } }) => {
      const posts = await getUserHotPosts.execute({
        offset: cursor,
        userName: userName,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getUserNewPosts: procedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        userName: z.string(),
      }),
    )
    .query(async ({ input: { cursor, userName } }) => {
      const posts = await getUserNewPosts.execute({
        offset: cursor,
        userName: userName,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getUserControversialPosts: procedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        userName: z.string(),
      }),
    )
    .query(async ({ input: { cursor, userName } }) => {
      const posts = await getUserControversialPosts.execute({
        offset: cursor,
        userName: userName,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getCommunityBestPosts: procedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        communityName: z.string(),
      }),
    )
    .query(async ({ input: { cursor, communityName } }) => {
      const posts = await getCommunityBestPosts.execute({
        offset: cursor,
        communityName: communityName,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getCommunityHotPosts: procedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        communityName: z.string(),
      }),
    )
    .query(async ({ input: { cursor, communityName } }) => {
      const posts = await getCommunityHotPosts.execute({
        offset: cursor,
        communityName: communityName,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getCommunityNewPosts: procedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        communityName: z.string(),
      }),
    )
    .query(async ({ input: { cursor, communityName } }) => {
      const posts = await getCommunityNewPosts.execute({
        offset: cursor,
        communityName: communityName,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getCommunityControversialPosts: procedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        communityName: z.string(),
      }),
    )
    .query(async ({ input: { cursor, communityName } }) => {
      const posts = await getCommunityControversialPosts.execute({
        offset: cursor,
        communityName: communityName,
      });

      const nextCursor = getInfiniteQueryCursor({
        postsLength: posts.length,
        cursor,
      });

      return { posts, nextCursor };
    }),
  getUserImage: protectedProcedure
    .input(UserSchema.shape.name)
    .query(({ input }) => {
      if (input === undefined) return null;
      return getUserImage.execute({ name: input });
    }),
  getCommunityImage: protectedProcedure
    .input(CommunitySchema.shape.name)
    .query(({ input }) => {
      if (input === undefined) return null;
      return getCommunityImage.execute({ name: input });
    }),
  getFavoriteCommunities: protectedProcedure.query(({ ctx }) => {
    return getFavoriteCommunities(ctx.auth.userId);
  }),
  getModeratedCommunities: protectedProcedure.query(({ ctx }) => {
    return getModeratedCommunities(ctx.auth.userId);
  }),
  getJoinedCommunities: protectedProcedure.query(({ ctx }) => {
    return getJoinedCommunities(ctx.auth.userId);
  }),
  setFavoriteCommunity: protectedProcedure
    .input(
      UserToCommunitySchema.pick({
        communityId: true,
        favorite: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return setFavoriteCommunity({ ...input, userId: ctx.auth.userId });
    }),

  deletePost: protectedProcedure
    .input(PostSchema.shape.id)
    .mutation(({ input }) => {
      return deletePost(input);
    }),
  upvotePost: protectedProcedure
    .input(UserToPostSchema.pick({ postId: true, voteStatus: true }))
    .mutation(({ input, ctx }) => {
      return upvotePost({ ...input, userId: ctx.auth.userId });
    }),
  downvotePost: protectedProcedure
    .input(UserToPostSchema.pick({ postId: true, voteStatus: true }))
    .mutation(({ input, ctx }) => {
      return downvotePost({ ...input, userId: ctx.auth.userId });
    }),
  setPostSpoilerTag: protectedProcedure
    .input(
      PostSchema.pick({
        id: true,
        spoiler: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return setPostSpoilerTag({ ...input, authorId: ctx.auth.userId });
    }),
  setPostNSFWTag: protectedProcedure
    .input(
      PostSchema.pick({
        id: true,
        nsfw: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return setPostNSFWTag({ ...input, authorId: ctx.auth.userId });
    }),
});

export type AppRouter = typeof appRouter;

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
