import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";

import {
  getFavoriteCommunities,
  getJoinedCommunities,
  getModeratedCommunities,
  setFavoriteCommunity,
} from "@/lib/api/communities";
import { getCommunityImageUrl, getUserImageUrl } from "@/lib/api/getImageUrl";
import {
  deletePost,
  downvotePost,
  updatePostNSFWTag,
  updatePostSpoilerTag,
  upvotePost,
} from "@/lib/api/posts";
import {
  getAllBestPosts,
  getAllControversialPosts,
  getAllHotPosts,
  getAllNewPosts,
} from "@/lib/api/posts/getAllPosts";
import {
  getCommunityBestPosts,
  getCommunityControversialPosts,
  getCommunityHotPosts,
  getCommunityNewPosts,
} from "@/lib/api/posts/getCommunityPosts";
import {
  getHomeBestPosts,
  getHomeControversialPosts,
  getHomeHotPosts,
  getHomeNewPosts,
} from "@/lib/api/posts/getHomePosts";
import {
  getUserBestPosts,
  getUserControversialPosts,
  getUserHotPosts,
  getUserNewPosts,
} from "@/lib/api/posts/getUserPosts";
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
  search: router({
    users: procedure.input(z.string()).query(({ input }) => {
      return searchUsers.execute({ search: `%${input}%` });
    }),
    communities: procedure.input(z.string()).query(({ input }) => {
      return searchCommunities.execute({ search: `%${input}%` });
    }),
  }),
  posts: router({
    allBest: procedure
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
    allHot: procedure
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
    allNew: procedure
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
    allControversial: procedure
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
    homeBest: protectedProcedure
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
    homeHot: protectedProcedure
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
    homeNew: protectedProcedure
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
    homeControversial: protectedProcedure
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
    userBest: procedure
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
    userHot: procedure
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
    userNew: procedure
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
    userControversial: procedure
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
    communityBest: procedure
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
    communityHot: procedure
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
    communityNew: procedure
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
    communityControversial: procedure
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
  }),
  image: router({
    user: protectedProcedure.input(UserSchema.shape.name).query(({ input }) => {
      if (input === undefined) return null;
      return getUserImageUrl.execute({ name: input });
    }),
    community: protectedProcedure
      .input(CommunitySchema.shape.name)
      .query(({ input }) => {
        if (input === undefined) return null;
        return getCommunityImageUrl.execute({ name: input });
      }),
  }),
  communities: router({
    favorite: protectedProcedure.query(({ ctx }) => {
      return getFavoriteCommunities(ctx.auth.userId);
    }),
    moderated: protectedProcedure.query(({ ctx }) => {
      return getModeratedCommunities(ctx.auth.userId);
    }),
    joined: protectedProcedure.query(({ ctx }) => {
      return getJoinedCommunities(ctx.auth.userId);
    }),
  }),
  community: router({
    setFavorite: protectedProcedure
      .input(
        UserToCommunitySchema.pick({
          communityId: true,
          favorite: true,
        }),
      )
      .mutation(({ input, ctx }) => {
        return setFavoriteCommunity({ ...input, userId: ctx.auth.userId });
      }),
  }),
  post: router({
    delete: protectedProcedure
      .input(PostSchema.shape.id)
      .mutation(({ input }) => {
        return deletePost(input);
      }),
    upvote: protectedProcedure
      .input(UserToPostSchema.pick({ postId: true, voteStatus: true }))
      .mutation(({ input, ctx }) => {
        return upvotePost({ ...input, userId: ctx.auth.userId });
      }),
    downvote: protectedProcedure
      .input(UserToPostSchema.pick({ postId: true, voteStatus: true }))
      .mutation(({ input, ctx }) => {
        return downvotePost({ ...input, userId: ctx.auth.userId });
      }),
    tagSpoiler: protectedProcedure
      .input(
        PostSchema.pick({
          id: true,
          spoiler: true,
        }),
      )
      .mutation(({ input, ctx }) => {
        return updatePostSpoilerTag({ ...input, authorId: ctx.auth.userId });
      }),
    tagNsfw: protectedProcedure
      .input(
        PostSchema.pick({
          id: true,
          nsfw: true,
        }),
      )
      .mutation(({ input, ctx }) => {
        return updatePostNSFWTag({ ...input, authorId: ctx.auth.userId });
      }),
  }),
});

export type AppRouter = typeof appRouter;

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
