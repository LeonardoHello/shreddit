import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { and, eq, inArray } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

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
import { PostFilter, PostSort } from "@/types";
import getUserPosts from "@/utils/getUserPosts";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  infiniteQueryPosts: createTRPCRouter({
    getAllPosts: baseProcedure
      .input(
        z.object({
          // cursor input needed to expose useInfiniteQuery hook
          // value of the cursor is what's returned from getNextPageParam
          cursor: z.number().nullish(),
          currentUserId: UserSchema.shape.id.nullable(),
          sort: z.nativeEnum(PostSort).optional(),
        }),
      )
      .query(async ({ input }) => {
        let posts;
        switch (input.sort) {
          case PostSort.HOT:
            posts = await getAllHotPosts.execute({
              currentUserId: input.currentUserId,
              offset: input.cursor,
            });
            break;

          case PostSort.NEW:
            posts = await getAllNewPosts.execute({
              currentUserId: input.currentUserId,
              offset: input.cursor,
            });
            break;

          case PostSort.CONTROVERSIAL:
            posts = await getAllControversialPosts.execute({
              currentUserId: input.currentUserId,
              offset: input.cursor,
            });
            break;

          default:
            posts = await getAllBestPosts.execute({
              currentUserId: input.currentUserId,
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
          currentUserId: UserSchema.shape.id,
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
          currentUserId: UserSchema.shape.id.nullable(),
          communityName: CommunitySchema.shape.name,
          sort: z.nativeEnum(PostSort).optional(),
        }),
      )
      .query(async ({ input }) => {
        let posts;
        switch (input.sort) {
          case PostSort.HOT:
            posts = await getCommunityHotPosts.execute({
              currentUserId: input.currentUserId,
              communityName: input.communityName,
              offset: input.cursor,
            });
            break;

          case PostSort.NEW:
            posts = await getCommunityNewPosts.execute({
              currentUserId: input.currentUserId,
              communityName: input.communityName,
              offset: input.cursor,
            });
            break;

          case PostSort.CONTROVERSIAL:
            posts = await getCommunityControversialPosts.execute({
              currentUserId: input.currentUserId,
              communityName: input.communityName,
              offset: input.cursor,
            });
            break;

          default:
            posts = await getCommunityBestPosts.execute({
              currentUserId: input.currentUserId,
              communityName: input.communityName,
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
    getUserPosts: baseProcedure
      .input(
        z.object({
          cursor: z.number().nullish(),
          currentUserId: UserSchema.shape.id.nullable(),
          userId: UserSchema.shape.id,
          username: UserSchema.shape.name,
          filter: z.nativeEnum(PostFilter).optional(),
          sort: z.nativeEnum(PostSort).optional(),
        }),
      )
      .query(async ({ input }) => {
        const posts = await getUserPosts(input);

        let nextCursor: typeof input.cursor = undefined;
        if (posts.length === 10) {
          nextCursor = input.cursor ? input.cursor + 10 : 10;
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
  createPostText: protectedProcedure
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
  createPostImage: protectedProcedure
    .input(
      PostSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
      }).and(
        z.object({
          files: FileSchema.omit({ id: true, postId: true }).array(),
        }),
      ),
    )
    .mutation(({ input, ctx }) => {
      const { files: postFiles, ...post } = input;

      const postId = uuidv4();

      return ctx.db.batch([
        ctx.db
          .insert(posts)
          .values({ ...post, text: null, id: postId, authorId: ctx.userId })
          .returning({ id: posts.id }),
        ctx.db
          .insert(files)
          .values(postFiles.map((file) => ({ ...file, postId }))),
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
