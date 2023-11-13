import { z } from "zod";

import { getCommunityImageUrl, getUserImageUrl } from "@/lib/api/getImageUrl";
import { getJoinedCommunitiesPosts } from "@/lib/api/getJoinedCommunitiesPosts";
import { searchCommunities, searchUsers } from "@/lib/api/searchShreddit";
import toggleFavoriteCommunity from "@/lib/api/toggleFavoriteCommunity";
import {
  CommunitySchema,
  UserSchema,
  UserToCommunitySchema,
} from "@/lib/db/schema";

import { procedure, protectedProcedure, router } from "./";

import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server";
export const appRouter = router({
  favorite: protectedProcedure
    .input(
      UserToCommunitySchema.pick({
        userId: true,
        communityId: true,
        favorite: true,
      }),
    )
    .mutation(async ({ input }) => {
      await toggleFavoriteCommunity(
        input.userId,
        input.communityId,
        input.favorite,
      );
    }),
  communityImage: protectedProcedure
    .input(CommunitySchema.shape.name.optional())
    .query(({ input }) => {
      if (input === undefined) return null;
      return getCommunityImageUrl.execute({ name: input });
    }),
  userImage: protectedProcedure
    .input(UserSchema.shape.name.optional())
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
        // "cursor" input needed to expose useInfiniteQuery hook
        cursor: z.number().nullable(),
        communityIds: z.string().uuid().array(),
      }),
    )
    .query(async ({ input }) => {
      const posts = await getJoinedCommunitiesPosts(input.communityIds).execute(
        {
          offset: input.cursor,
        },
      );

      // since limit is set to 10, setting nextCursor (offset) to 10 to fetch next 10 posts
      let nextCursor: typeof input.cursor = null;
      if (posts.length === 10) {
        nextCursor = input.cursor! + 10;
      }

      return { posts, nextCursor };
    }),
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
