import { z } from "zod";

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
  getDownvotedBestPosts,
  getDownvotedControversialPosts,
  getDownvotedHotPosts,
  getDownvotedNewPosts,
} from "@/api/getPosts/getDownvotedPosts";
import {
  getHiddenBestPosts,
  getHiddenControversialPosts,
  getHiddenHotPosts,
  getHiddenNewPosts,
} from "@/api/getPosts/getHiddenPosts";
import {
  getHomeBestPosts,
  getHomeControversialPosts,
  getHomeHotPosts,
  getHomeNewPosts,
} from "@/api/getPosts/getHomePosts";
import {
  getSavedBestPosts,
  getSavedControversialPosts,
  getSavedHotPosts,
  getSavedNewPosts,
} from "@/api/getPosts/getSavedPosts";
import {
  getUpvotedBestPosts,
  getUpvotedControversialPosts,
  getUpvotedHotPosts,
  getUpvotedNewPosts,
} from "@/api/getPosts/getUpvotedPosts";
import {
  getUserBestPosts,
  getUserControversialPosts,
  getUserHotPosts,
  getUserNewPosts,
} from "@/api/getPosts/getUserPosts";
import { CommunitySchema, UserSchema } from "@/db/schema";
import { PostSort } from "@/types";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";

export const postFeedRouter = createTRPCRouter({
  getAllPosts: baseProcedure
    .input(
      z.object({
        // cursor input needed to expose useInfiniteQuery hook
        // value of the cursor is what's returned from getNextPageParam
        cursor: z.number().nullish(),
        sort: z.nativeEnum(PostSort),
      }),
    )
    .query(async ({ input, ctx }) => {
      const sortQueries = {
        [PostSort.HOT]: getAllHotPosts,
        [PostSort.NEW]: getAllNewPosts,
        [PostSort.CONTROVERSIAL]: getAllControversialPosts,
        [PostSort.BEST]: getAllBestPosts,
      };

      // Get the appropriate query function or default to BEST
      const queryFn = sortQueries[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
  getHomePosts: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        sort: z.nativeEnum(PostSort),
      }),
    )
    .query(async ({ input, ctx }) => {
      const sortQueries = {
        [PostSort.HOT]: getHomeHotPosts,
        [PostSort.NEW]: getHomeNewPosts,
        [PostSort.CONTROVERSIAL]: getHomeControversialPosts,
        [PostSort.BEST]: getHomeBestPosts,
      };

      const queryFn = sortQueries[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
  getCommunityPosts: baseProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        sort: z.nativeEnum(PostSort),
        communityName: CommunitySchema.shape.name,
      }),
    )
    .query(async ({ input, ctx }) => {
      const sortQueries = {
        [PostSort.HOT]: getCommunityHotPosts,
        [PostSort.NEW]: getCommunityNewPosts,
        [PostSort.CONTROVERSIAL]: getCommunityControversialPosts,
        [PostSort.BEST]: getCommunityBestPosts,
      };

      const queryFn = sortQueries[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
        communityName: input.communityName,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
  getUserPosts: baseProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        sort: z.nativeEnum(PostSort),
        userId: UserSchema.shape.id,
      }),
    )
    .query(async ({ input, ctx }) => {
      const sortQueries = {
        [PostSort.HOT]: getUserHotPosts,
        [PostSort.NEW]: getUserNewPosts,
        [PostSort.CONTROVERSIAL]: getUserControversialPosts,
        [PostSort.BEST]: getUserBestPosts,
      };

      const queryFn = sortQueries[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
        userId: input.userId,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
  getUpvotedPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        sort: z.nativeEnum(PostSort),
        userId: UserSchema.shape.id,
      }),
    )
    .query(async ({ input, ctx }) => {
      const sortQueries = {
        [PostSort.HOT]: getUpvotedHotPosts,
        [PostSort.NEW]: getUpvotedNewPosts,
        [PostSort.CONTROVERSIAL]: getUpvotedControversialPosts,
        [PostSort.BEST]: getUpvotedBestPosts,
      };

      const queryFn = sortQueries[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
        userId: input.userId,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
  getDownvotedPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        sort: z.nativeEnum(PostSort),
        userId: UserSchema.shape.id,
      }),
    )
    .query(async ({ input, ctx }) => {
      const sortQueries = {
        [PostSort.HOT]: getDownvotedHotPosts,
        [PostSort.NEW]: getDownvotedNewPosts,
        [PostSort.CONTROVERSIAL]: getDownvotedControversialPosts,
        [PostSort.BEST]: getDownvotedBestPosts,
      };

      const queryFn = sortQueries[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
        userId: input.userId,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
  getSavedPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        sort: z.nativeEnum(PostSort),
        userId: UserSchema.shape.id,
      }),
    )
    .query(async ({ input, ctx }) => {
      const sortQueries = {
        [PostSort.HOT]: getSavedHotPosts,
        [PostSort.NEW]: getSavedNewPosts,
        [PostSort.CONTROVERSIAL]: getSavedControversialPosts,
        [PostSort.BEST]: getSavedBestPosts,
      };

      const queryFn = sortQueries[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
        userId: input.userId,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
  getHiddenPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        sort: z.nativeEnum(PostSort),
        userId: UserSchema.shape.id,
      }),
    )
    .query(async ({ input, ctx }) => {
      const sortQueries = {
        [PostSort.HOT]: getHiddenHotPosts,
        [PostSort.NEW]: getHiddenNewPosts,
        [PostSort.CONTROVERSIAL]: getHiddenControversialPosts,
        [PostSort.BEST]: getHiddenBestPosts,
      };

      const queryFn = sortQueries[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
        userId: input.userId,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
});
