import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import {
  getFavoriteCommunities,
  getJoinedCommunities,
  getModeratedCommunities,
} from "@/lib/api/getCommunities";
import { getUserToCommunity } from "@/lib/api/getCommunity";
import { getCommunityImage, getUserImage } from "@/lib/api/getImage";
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
} from "@/lib/api/getPosts";
import { searchCommunities, searchUsers } from "@/lib/api/search";
import {
  CommunitySchema,
  PostSchema,
  UserSchema,
  UserToCommunitySchema,
  UserToPostSchema,
  communities,
  posts,
  usersToCommunities,
  usersToPosts,
} from "@/lib/db/schema";
import { SortPostsBy } from "@/lib/types";

import { procedure, protectedProcedure, router } from ".";

export const appRouter = router({
  infiniteQueryPosts: router({
    getAllPosts: procedure
      .input(
        z.object({
          // cursor input needed to expose useInfiniteQuery hook
          // value of the cursor is what's returned from getNextPageParam
          cursor: z.number().nullish(),
          sortBy: z.nativeEnum(SortPostsBy),
        }),
      )
      .query(async ({ input }) => {
        let posts;
        switch (input.sortBy) {
          case SortPostsBy.BEST:
            posts = await getAllBestPosts.execute({
              offset: input.cursor,
            });
            break;

          case SortPostsBy.HOT:
            posts = await getAllHotPosts.execute({
              offset: input.cursor,
            });
            break;

          case SortPostsBy.NEW:
            posts = await getAllNewPosts.execute({
              offset: input.cursor,
            });
            break;

          default:
            posts = await getAllControversialPosts.execute({
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
    getHomePosts: protectedProcedure
      .input(
        z.object({
          cursor: z.number().nullish(),
          sortBy: z.nativeEnum(SortPostsBy),
        }),
      )
      .query(async ({ input, ctx }) => {
        let posts;
        switch (input.sortBy) {
          case SortPostsBy.BEST:
            posts = await getHomeBestPosts.execute({
              offset: input.cursor,
              userId: ctx.auth.userId,
            });
            break;

          case SortPostsBy.HOT:
            posts = await getHomeHotPosts.execute({
              offset: input.cursor,
              userId: ctx.auth.userId,
            });
            break;

          case SortPostsBy.NEW:
            posts = await getHomeNewPosts.execute({
              offset: input.cursor,
              userId: ctx.auth.userId,
            });
            break;

          default:
            posts = await getHomeControversialPosts.execute({
              offset: input.cursor,
              userId: ctx.auth.userId,
            });
            break;
        }

        let nextCursor: typeof input.cursor = null;
        if (posts.length === 10) {
          nextCursor = input.cursor! + 10;
        }

        return { posts, nextCursor };
      }),
    getUserPosts: procedure
      .input(
        z.object({
          cursor: z.number().nullish(),
          sortBy: z.nativeEnum(SortPostsBy),
          userName: z.string(),
        }),
      )
      .query(async ({ input: { cursor, sortBy, userName } }) => {
        let posts;
        switch (sortBy) {
          case SortPostsBy.BEST:
            posts = await getUserBestPosts.execute({
              offset: cursor,
              userName,
            });
            break;

          case SortPostsBy.HOT:
            posts = await getUserHotPosts.execute({
              offset: cursor,
              userName,
            });
            break;

          case SortPostsBy.NEW:
            posts = await getUserNewPosts.execute({
              offset: cursor,
              userName,
            });
            break;

          default:
            posts = await getUserControversialPosts.execute({
              offset: cursor,
              userName,
            });
            break;
        }

        let nextCursor: typeof cursor = null;
        if (posts.length === 10) {
          nextCursor = cursor! + 10;
        }

        return { posts, nextCursor };
      }),
    getCommunityPosts: procedure
      .input(
        z.object({
          cursor: z.number().nullish(),
          sortBy: z.nativeEnum(SortPostsBy),
          communityName: z.string(),
        }),
      )
      .query(async ({ input: { cursor, sortBy, communityName } }) => {
        let posts;
        switch (sortBy) {
          case SortPostsBy.BEST:
            posts = await getCommunityBestPosts.execute({
              offset: cursor,
              communityName,
            });
            break;

          case SortPostsBy.HOT:
            posts = await getCommunityHotPosts.execute({
              offset: cursor,
              communityName,
            });
            break;

          case SortPostsBy.NEW:
            posts = await getCommunityNewPosts.execute({
              offset: cursor,
              communityName,
            });
            break;

          default:
            posts = await getCommunityControversialPosts.execute({
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
  }),
  searchUsers: procedure.input(z.string()).query(({ input }) => {
    return searchUsers.execute({ search: `%${input}%` });
  }),
  searchCommunities: procedure.input(z.string()).query(({ input }) => {
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
    return getFavoriteCommunities(ctx.auth.userId);
  }),
  getModeratedCommunities: protectedProcedure.query(({ ctx }) => {
    return getModeratedCommunities(ctx.auth.userId);
  }),
  getJoinedCommunities: protectedProcedure.query(({ ctx }) => {
    return getJoinedCommunities(ctx.auth.userId);
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
      return ctx.db.delete(communities).where(eq(communities.id, input));
    }),
  getUserToCommunity: procedure
    .input(UserToCommunitySchema.shape.communityId)
    .query(({ input, ctx }) => {
      return getUserToCommunity.execute({
        userId: ctx.auth.userId,
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
          userId: ctx.auth.userId,
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { favorite: input.favorite },
        })
        .returning({ favorite: usersToCommunities.favorite });
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
          userId: ctx.auth.userId,
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
          userId: ctx.auth.userId,
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { muted: input.muted },
        })
        .returning({ muted: usersToCommunities.muted });
    }),
  deletePost: protectedProcedure
    .input(PostSchema.shape.id)
    .mutation(({ input, ctx }) => {
      return ctx.db.delete(posts).where(eq(posts.id, input));
    }),
  votePost: protectedProcedure
    .input(UserToPostSchema.pick({ postId: true, voteStatus: true }))
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(usersToPosts)
        .values({ ...input, userId: ctx.auth.userId })
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
        .where(and(eq(posts.authorId, ctx.auth.userId), eq(posts.id, input.id)))
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
        .where(and(eq(posts.authorId, ctx.auth.userId), eq(posts.id, input.id)))
        .returning({ nsfw: posts.nsfw });
    }),
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
