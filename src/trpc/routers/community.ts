import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import {
  getJoinedCommunities,
  getModeratedCommunities,
  getMutedCommunities,
  getMyCommunities,
} from "@/api/getCommunities";
import {
  getCommunityByName,
  getCommunityImage,
  getSelectedCommunity,
  getUserToCommunity,
} from "@/api/getCommunity";
import { searchCommunities } from "@/api/search";
import {
  communities,
  CommunitySchema,
  usersToCommunities,
  UserToCommunitySchema,
} from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";

export const communityRouter = createTRPCRouter({
  getCommunityByName: baseProcedure
    .input(CommunitySchema.shape.name)
    .query(async ({ input }) => {
      const data = await getCommunityByName.execute({ communityName: input });

      if (!data) throw new TRPCError({ code: "NOT_FOUND" });

      return data;
    }),
  getSelectedCommunity: protectedProcedure
    .input(CommunitySchema.shape.name)
    .query(async ({ input }) => {
      const data = await getSelectedCommunity.execute({ communityName: input });

      if (!data) throw new TRPCError({ code: "NOT_FOUND" });

      return data;
    }),
  searchCommunities: baseProcedure
    .input(
      z.object({
        search: z.string(),
        limit: z.number().positive().optional(),
      }),
    )
    .query(({ input }) => {
      return searchCommunities.execute({
        search: `%${input.search}%`,
        limit: input.limit,
      });
    }),
  getUserToCommunity: protectedProcedure
    .input(CommunitySchema.shape.name)
    .query(async ({ input, ctx }) => {
      const data = await getUserToCommunity.execute({
        currentUserId: ctx.userId,
        communityName: input,
      });
      return (
        data ?? {
          muted: false,
          favorited: false,
          joined: false,
        }
      );
    }),
  getCommunityImage: protectedProcedure
    .input(CommunitySchema.shape.name)
    .query(({ input }) => {
      return getCommunityImage.execute({ communityName: input });
    }),
  getMyCommunities: protectedProcedure.query(({ ctx }) => {
    return getMyCommunities.execute({ currentUserId: ctx.userId });
  }),
  getRecentCommunities: baseProcedure
    .input(
      CommunitySchema.pick({
        id: true,
        name: true,
        icon: true,
      })
        .array()
        .nullable(),
    )
    .query(({ input }) => {
      if (!input) {
        return [];
      }
      return input;
    }),
  getModeratedCommunities: protectedProcedure.query(({ ctx }) => {
    return getModeratedCommunities.execute({ currentUserId: ctx.userId });
  }),
  getJoinedCommunities: protectedProcedure.query(({ ctx }) => {
    return getJoinedCommunities.execute({ currentUserId: ctx.userId });
  }),
  getMutedCommunities: protectedProcedure.query(({ ctx }) => {
    return getMutedCommunities.execute({ currentUserId: ctx.userId });
  }),
  editCommunity: protectedProcedure
    .input(
      CommunitySchema.pick({
        id: true,
        displayName: true,
        description: true,
        memberNickname: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      const { id, ...rest } = input;

      return ctx.db
        .update(communities)
        .set({ ...rest })
        .where(eq(communities.id, id));
    }),
  deleteCommunity: protectedProcedure
    .input(CommunitySchema.shape.id)
    .mutation(({ input, ctx }) => {
      return ctx.db.delete(communities).where(eq(communities.id, input));
    }),
  toggleFavoriteCommunity: protectedProcedure
    .input(
      UserToCommunitySchema.pick({
        communityId: true,
        favorited: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(usersToCommunities)
        .values({
          ...input,
          userId: ctx.userId,
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { favorited: input.favorited },
        })
        .returning({ favorited: usersToCommunities.favorited });
    }),
  toggleJoinCommunity: protectedProcedure
    .input(
      UserToCommunitySchema.pick({
        communityId: true,
        joined: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db
        .insert(usersToCommunities)
        .values({
          userId: ctx.userId,
          joinedAt: new Date(),
          ...input,
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { joined: input.joined, joinedAt: new Date() },
        })
        .returning({ joined: usersToCommunities.joined });
    }),
  toggleMuteCommunity: protectedProcedure
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
          userId: ctx.userId,
          ...input,
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { muted: input.muted },
        })
        .returning({ muted: usersToCommunities.muted });
    }),
  createCommunity: protectedProcedure
    .input(CommunitySchema.pick({ name: true, description: true }))
    .mutation(({ input, ctx }) => {
      const communityId = uuidv4();

      return ctx.db.batch([
        ctx.db
          .insert(communities)
          .values({ id: communityId, moderatorId: ctx.userId, ...input })
          .returning({ name: communities.name }),
        ctx.db.insert(usersToCommunities).values({
          userId: ctx.userId,
          communityId,
        }),
      ]);
    }),
});
