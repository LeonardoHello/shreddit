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
        sort: z.nativeEnum(PostSort).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      let posts;
      switch (input.sort) {
        case PostSort.HOT:
          posts = await getAllHotPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        case PostSort.NEW:
          posts = await getAllNewPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        case PostSort.CONTROVERSIAL:
          posts = await getAllControversialPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        default:
          posts = await getAllBestPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;
      }

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
        sort: z.nativeEnum(PostSort).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      let posts;
      switch (input.sort) {
        case PostSort.HOT:
          posts = await getHomeHotPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        case PostSort.NEW:
          posts = await getHomeNewPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        case PostSort.CONTROVERSIAL:
          posts = await getHomeControversialPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        default:
          posts = await getHomeBestPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;
      }

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
        sort: z.nativeEnum(PostSort).optional(),
        communityName: CommunitySchema.shape.name,
      }),
    )
    .query(async ({ input, ctx }) => {
      let posts;
      switch (input.sort) {
        case PostSort.HOT:
          posts = await getCommunityHotPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
            communityName: input.communityName,
          });
          break;

        case PostSort.NEW:
          posts = await getCommunityNewPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
            communityName: input.communityName,
          });
          break;

        case PostSort.CONTROVERSIAL:
          posts = await getCommunityControversialPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
            communityName: input.communityName,
          });
          break;

        default:
          posts = await getCommunityBestPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
            communityName: input.communityName,
          });
          break;
      }

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
        sort: z.nativeEnum(PostSort).optional(),
        username: UserSchema.shape.username,
      }),
    )
    .query(async ({ input, ctx }) => {
      let posts;
      switch (input.sort) {
        case PostSort.HOT:
          posts = await getUserHotPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
            username: input.username,
          });
          break;

        case PostSort.NEW:
          posts = await getUserNewPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
            username: input.username,
          });
          break;

        case PostSort.CONTROVERSIAL:
          posts = await getUserControversialPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
            username: input.username,
          });
          break;

        default:
          posts = await getUserBestPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
            username: input.username,
          });
          break;
      }

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
        sort: z.nativeEnum(PostSort).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      let posts;
      switch (input.sort) {
        case PostSort.HOT:
          posts = await getUpvotedHotPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        case PostSort.NEW:
          posts = await getUpvotedNewPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        case PostSort.CONTROVERSIAL:
          posts = await getUpvotedControversialPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        default:
          posts = await getUpvotedBestPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;
      }

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
        sort: z.nativeEnum(PostSort).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      let posts;
      switch (input.sort) {
        case PostSort.HOT:
          posts = await getDownvotedHotPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        case PostSort.NEW:
          posts = await getDownvotedNewPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        case PostSort.CONTROVERSIAL:
          posts = await getDownvotedControversialPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        default:
          posts = await getDownvotedBestPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;
      }

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
        sort: z.nativeEnum(PostSort).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      let posts;
      switch (input.sort) {
        case PostSort.HOT:
          posts = await getSavedHotPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        case PostSort.NEW:
          posts = await getSavedNewPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        case PostSort.CONTROVERSIAL:
          posts = await getSavedControversialPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        default:
          posts = await getSavedBestPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;
      }

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
        sort: z.nativeEnum(PostSort).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      let posts;
      switch (input.sort) {
        case PostSort.HOT:
          posts = await getHiddenHotPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        case PostSort.NEW:
          posts = await getHiddenNewPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        case PostSort.CONTROVERSIAL:
          posts = await getHiddenControversialPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;

        default:
          posts = await getHiddenBestPosts.execute({
            currentUserId: ctx.userId,
            offset: input.cursor,
          });
          break;
      }

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
});
