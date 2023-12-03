import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

import { updateFavoriteCommunity } from "@/lib/api/communities";
import { getCommunityImageUrl, getUserImageUrl } from "@/lib/api/getImageUrl";
import {
  deletePost,
  downvotePost,
  getJoinedCommunitiesPosts,
  updatePostNSFWTag,
  updatePostSpoilerTag,
  upvotePost,
} from "@/lib/api/posts";
import { searchCommunities, searchUsers } from "@/lib/api/search";
import {
  CommunitySchema,
  PostSchema,
  UserSchema,
  UserToCommunitySchema,
  UserToPostSchema,
} from "@/lib/db/schema";

import { procedure, protectedProcedure, router } from ".";

export const appRouter = router({
  communityImage: protectedProcedure
    .input(CommunitySchema.shape.name)
    .query(({ input }) => {
      if (input === undefined) return null;
      return getCommunityImageUrl.execute({ name: input });
    }),
  userImage: protectedProcedure
    .input(UserSchema.shape.name)
    .query(({ input }) => {
      if (input === undefined) return null;
      return getUserImageUrl.execute({ name: input });
    }),
  searchUsers: procedure.input(z.string()).query(({ input }) => {
    return searchUsers.execute({ search: `%${input}%` });
  }),
  searchCommunities: procedure.input(z.string()).query(({ input }) => {
    return searchCommunities.execute({ search: `%${input}%` });
  }),
  joinedCommunitiesPosts: protectedProcedure
    .input(
      z.object({
        // cursor input needed to expose useInfiniteQuery hook
        // value of the cursor is what's returned from getNextPageParam
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const posts = await getJoinedCommunitiesPosts(ctx.auth.userId).execute({
        offset: input.cursor,
      });

      // since limit is set to 10, checking if the new batch of posts is equal to it's limit which would indicate that there are possibly more posts to fetch, then incrementing cursor (offset) by 10
      let nextCursor: typeof input.cursor = null;
      if (posts.length === 10) {
        nextCursor = input.cursor! + 10;
      }

      return { posts, nextCursor };
    }),
  favoriteCommunity: protectedProcedure
    .input(
      UserToCommunitySchema.pick({
        userId: true,
        communityId: true,
        favorite: true,
      }),
    )
    .mutation(({ input }) => {
      return updateFavoriteCommunity(input);
    }),
  spoilerTag: protectedProcedure
    .input(
      PostSchema.pick({
        authorId: true,
        id: true,
        spoiler: true,
      }),
    )
    .mutation(({ input }) => {
      return updatePostSpoilerTag(input);
    }),
  nsfwTag: protectedProcedure
    .input(
      PostSchema.pick({
        authorId: true,
        id: true,
        nsfw: true,
      }),
    )
    .mutation(({ input }) => {
      return updatePostNSFWTag(input);
    }),
  deletePost: protectedProcedure
    .input(PostSchema.shape.id)
    .mutation(({ input }) => {
      return deletePost(input);
    }),
  upvotePost: protectedProcedure
    .input(UserToPostSchema.pick({ postId: true, upvoted: true }))
    .mutation(({ input, ctx }) => {
      return upvotePost({ ...input, userId: ctx.auth.userId });
    }),
  downvotePost: protectedProcedure
    .input(UserToPostSchema.pick({ postId: true, downvoted: true }))
    .mutation(({ input, ctx }) => {
      return downvotePost({ ...input, userId: ctx.auth.userId });
    }),
});

export type AppRouter = typeof appRouter;

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
