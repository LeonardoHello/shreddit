import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  getFavoriteCommunities,
  getJoinedCommunities,
  getModeratedCommunities,
} from "@/api/getCommunities";
import { getCommunityImage, getUserToCommunity } from "@/api/getCommunity";
import { searchCommunities } from "@/api/search";
import {
  communities,
  CommunitySchema,
  usersToCommunities,
  UserToCommunitySchema,
} from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";

export const communityRouter = createTRPCRouter({
  searchCommunities: baseProcedure.input(z.string()).query(({ input }) => {
    return searchCommunities.execute({ search: `%${input}%` });
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
});
