import { z } from "zod";

import { CommunitySchema } from "@/db/schema/communities";
import { UserSchema } from "@/db/schema/users";
import { PostSort } from "@/types/enums";
import { postFeedQuery } from "@/utils/postFeedQuery";
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
      const allPosts = postFeedQuery("all");

      const queryFn = {
        [PostSort.BEST]: allPosts(PostSort.BEST),
        [PostSort.HOT]: allPosts(PostSort.HOT),
        [PostSort.NEW]: allPosts(PostSort.NEW),
        [PostSort.CONTROVERSIAL]: allPosts(PostSort.CONTROVERSIAL),
      }[input.sort];

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
      const homePosts = postFeedQuery("home");

      const queryFn = {
        [PostSort.BEST]: homePosts(PostSort.BEST),
        [PostSort.HOT]: homePosts(PostSort.HOT),
        [PostSort.NEW]: homePosts(PostSort.NEW),
        [PostSort.CONTROVERSIAL]: homePosts(PostSort.CONTROVERSIAL),
      }[input.sort];

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
      const communityPosts = postFeedQuery("community");

      const queryFn = {
        [PostSort.BEST]: communityPosts(PostSort.BEST),
        [PostSort.HOT]: communityPosts(PostSort.HOT),
        [PostSort.NEW]: communityPosts(PostSort.NEW),
        [PostSort.CONTROVERSIAL]: communityPosts(PostSort.CONTROVERSIAL),
      }[input.sort];

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
        username: UserSchema.shape.username,
      }),
    )
    .query(async ({ input, ctx }) => {
      const userPosts = postFeedQuery("user");

      const queryFn = {
        [PostSort.BEST]: userPosts(PostSort.BEST),
        [PostSort.HOT]: userPosts(PostSort.HOT),
        [PostSort.NEW]: userPosts(PostSort.NEW),
        [PostSort.CONTROVERSIAL]: userPosts(PostSort.CONTROVERSIAL),
      }[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
        username: input.username,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
  getUpvotedPosts: baseProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        sort: z.nativeEnum(PostSort),
        username: UserSchema.shape.username,
      }),
    )
    .query(async ({ input, ctx }) => {
      const upvotedPosts = postFeedQuery("upvoted");

      const queryFn = {
        [PostSort.BEST]: upvotedPosts(PostSort.BEST),
        [PostSort.HOT]: upvotedPosts(PostSort.HOT),
        [PostSort.NEW]: upvotedPosts(PostSort.NEW),
        [PostSort.CONTROVERSIAL]: upvotedPosts(PostSort.CONTROVERSIAL),
      }[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
        username: input.username,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
  getDownvotedPosts: baseProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        sort: z.nativeEnum(PostSort),
        username: UserSchema.shape.username,
      }),
    )
    .query(async ({ input, ctx }) => {
      const downvotedPosts = postFeedQuery("downvoted");

      const queryFn = {
        [PostSort.BEST]: downvotedPosts(PostSort.BEST),
        [PostSort.HOT]: downvotedPosts(PostSort.HOT),
        [PostSort.NEW]: downvotedPosts(PostSort.NEW),
        [PostSort.CONTROVERSIAL]: downvotedPosts(PostSort.CONTROVERSIAL),
      }[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
        username: input.username,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
  getSavedPosts: baseProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        sort: z.nativeEnum(PostSort),
        username: UserSchema.shape.username,
      }),
    )
    .query(async ({ input, ctx }) => {
      const savedPosts = postFeedQuery("saved");

      const queryFn = {
        [PostSort.BEST]: savedPosts(PostSort.BEST),
        [PostSort.HOT]: savedPosts(PostSort.HOT),
        [PostSort.NEW]: savedPosts(PostSort.NEW),
        [PostSort.CONTROVERSIAL]: savedPosts(PostSort.CONTROVERSIAL),
      }[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
        username: input.username,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
  getHiddenPosts: baseProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        sort: z.nativeEnum(PostSort),
        username: UserSchema.shape.username,
      }),
    )
    .query(async ({ input, ctx }) => {
      const hiddenPosts = postFeedQuery("hidden");

      const queryFn = {
        [PostSort.BEST]: hiddenPosts(PostSort.BEST),
        [PostSort.HOT]: hiddenPosts(PostSort.HOT),
        [PostSort.NEW]: hiddenPosts(PostSort.NEW),
        [PostSort.CONTROVERSIAL]: hiddenPosts(PostSort.CONTROVERSIAL),
      }[input.sort];

      const posts = await queryFn.execute({
        currentUserId: ctx.userId,
        offset: input.cursor,
        username: input.username,
      });

      let nextCursor: typeof input.cursor = undefined;
      if (posts.length === 10) {
        nextCursor = input.cursor ? input.cursor + 10 : 10;
      }

      return { posts, nextCursor };
    }),
});
