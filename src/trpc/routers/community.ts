import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod/v4";

import {
  communities,
  CommunitySchema,
  usersToCommunities,
  UserToCommunitySchema,
} from "@/db/schema/communities";
import { monthAgo } from "@/utils/getLastMonthDate";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";

export const communityRouter = createTRPCRouter({
  getCommunityByName: baseProcedure
    .input(CommunitySchema.shape.name)
    .query(async ({ input, ctx }) => {
      const data = await ctx.db.query.communities.findFirst({
        where: (community, { eq }) => eq(community.name, input),
        with: { moderator: true },
        extras: (community, { sql }) => ({
          memberCount: sql<number>`
            (
              SELECT COUNT(*) 
              FROM users_to_communities 
              WHERE users_to_communities.community_id = ${community.id} 
                AND users_to_communities.joined = true
            )
          `.as("member_count"),
          newMemberCount: sql<number>`
            (
              SELECT COUNT(*) 
              FROM users_to_communities 
              WHERE users_to_communities.community_id = ${community.id} 
                AND users_to_communities.joined = true 
                AND users_to_communities.joined_at > ${monthAgo}
            )
          `.as("new_member_count"),
        }),
      });

      return data ?? null;
    }),
  getSelectedCommunity: protectedProcedure
    .input(CommunitySchema.shape.name)
    .query(async ({ input, ctx }) => {
      const data = await ctx.db.query.communities.findFirst({
        where: (community, { eq }) => eq(community.name, input),
        columns: { id: true, name: true, icon: true, iconPlaceholder: true },
      });

      return data ?? null;
    }),
  searchCommunities: baseProcedure
    .input(
      z.object({
        search: z.string(),
        limit: z.number().positive().optional(),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.db.query.communities.findMany({
        limit: input.limit,
        where: (community, { ilike }) =>
          ilike(community.name, `%${input.search}%`),
        columns: { id: true, name: true, icon: true, iconPlaceholder: true },
        extras: (community, { sql }) => ({
          memberCount: sql<number>`
              (
                SELECT COUNT(*) 
                FROM users_to_communities 
                WHERE users_to_communities.community_id = ${community.id} 
                  AND users_to_communities.joined = true
              )
            `.as("member_count"),
        }),
      });
    }),
  getUserToCommunity: protectedProcedure
    .input(CommunitySchema.shape.name)
    .query(async ({ input, ctx }) => {
      const data = await ctx.db.query.usersToCommunities.findFirst({
        where: (userToCommunity, { and, eq, exists }) =>
          and(
            eq(userToCommunity.userId, ctx.userId),
            exists(
              ctx.db
                .select({ id: communities.id })
                .from(communities)
                .where(
                  and(
                    eq(communities.id, userToCommunity.communityId),
                    eq(communities.name, input),
                  ),
                ),
            ),
          ),
        columns: { favorited: true, muted: true, joined: true },
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
    .query(({ input, ctx }) => {
      return ctx.db.query.communities.findFirst({
        where: (community, { eq }) => eq(community.name, input),
        columns: { icon: true },
      });
    }),
  getMyCommunities: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.communities.findMany({
      where: (community, { and, eq, exists }) =>
        exists(
          ctx.db
            .select()
            .from(usersToCommunities)
            .where(
              and(
                eq(usersToCommunities.communityId, community.id),
                eq(usersToCommunities.userId, ctx.userId),
                eq(usersToCommunities.joined, true),
              ),
            ),
        ),
      columns: { id: true, name: true, icon: true, iconPlaceholder: true },
      extras: (community, { sql }) => ({
        memberCount: sql<number>`
          (
            SELECT COUNT(*) 
            FROM users_to_communities 
            WHERE users_to_communities.community_id = ${community.id} 
              AND users_to_communities.joined = true
          )
        `.as("member_count"),
      }),
    });
  }),
  getModeratedCommunities: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.usersToCommunities.findMany({
      where: (userToCommunity, { and, eq, exists }) =>
        exists(
          ctx.db
            .select({ id: communities.id })
            .from(communities)
            .where(
              and(
                eq(communities.moderatorId, ctx.userId),
                eq(communities.moderatorId, userToCommunity.userId),
                eq(communities.id, userToCommunity.communityId),
              ),
            ),
        ),
      columns: { favorited: true, favoritedAt: true },
      with: {
        community: {
          columns: { id: true, name: true, icon: true, iconPlaceholder: true },
        },
      },
    });
  }),
  getJoinedCommunities: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.usersToCommunities.findMany({
      where: (userToCommunity, { and, eq }) =>
        and(
          eq(userToCommunity.userId, ctx.userId),
          eq(userToCommunity.joined, true),
        ),
      columns: { favorited: true, favoritedAt: true },
      with: {
        community: {
          columns: { id: true, name: true, icon: true, iconPlaceholder: true },
        },
      },
    });
  }),
  getMutedCommunities: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.usersToCommunities.findMany({
      where: (userToCommunity, { and, eq }) =>
        and(
          eq(userToCommunity.userId, ctx.userId),
          eq(userToCommunity.muted, true),
        ),
      columns: { favorited: true, favoritedAt: true },
      with: {
        community: {
          columns: { id: true, name: true, icon: true, iconPlaceholder: true },
        },
      },
    });
  }),
  editCommunity: protectedProcedure
    .input(
      CommunitySchema.omit({
        updatedAt: true,
        createdAt: true,
        name: true,
        moderatorId: true,
      }),
    )
    .mutation(({ input, ctx }) => {
      const { id, ...rest } = input;

      return ctx.db
        .update(communities)
        .set({ ...rest })
        .where(
          and(eq(communities.moderatorId, ctx.userId), eq(communities.id, id)),
        );
    }),
  deleteCommunity: protectedProcedure
    .input(CommunitySchema.shape.id)
    .mutation(({ input, ctx }) => {
      return ctx.db
        .delete(communities)
        .where(
          and(
            eq(communities.moderatorId, ctx.userId),
            eq(communities.id, input),
          ),
        );
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
          favoritedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { favorited: input.favorited, favoritedAt: new Date() },
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
    .input(
      CommunitySchema.pick({
        name: true,
        description: true,
        icon: true,
        iconPlaceholder: true,
        banner: true,
        bannerPlaceholder: true,
      }),
    )
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
