import { validator } from "hono/validator";

import {
  communities,
  usersToCommunities,
  UserToCommunitySchema,
} from "@/db/schema/communities";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory, mwAuthenticated } from "../init";

export const userToCommunity = factory
  .createApp()
  .get("/:communityName/user", mwAuthenticated, async (c) => {
    const communityName = c.req.param("communityName");

    const data = await c.var.db.query.usersToCommunities.findFirst({
      where: (userToCommunity, { and, eq, exists }) =>
        and(
          eq(userToCommunity.userId, c.var.currentUserId),
          exists(
            c.var.db
              .select({ id: communities.id })
              .from(communities)
              .where(
                and(
                  eq(communities.id, userToCommunity.communityId),
                  eq(communities.name, communityName),
                ),
              ),
          ),
        ),
      columns: { favorited: true, muted: true, joined: true },
    });

    return c.json(data, 200);
  })
  .get("/joined/submit", mwAuthenticated, async (c) => {
    const data = await c.var.db.query.communities.findMany({
      where: (community, { and, eq, exists }) =>
        exists(
          c.var.db
            .select()
            .from(usersToCommunities)
            .where(
              and(
                eq(usersToCommunities.communityId, community.id),
                eq(usersToCommunities.userId, c.var.currentUserId),
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

    return c.json(data, 200);
  })
  .get("/joined", mwAuthenticated, async (c) => {
    const data = await c.var.db.query.usersToCommunities.findMany({
      where: (userToCommunity, { and, eq }) =>
        and(
          eq(userToCommunity.userId, c.var.currentUserId),
          eq(userToCommunity.joined, true),
        ),
      columns: { favorited: true, favoritedAt: true },
      with: {
        community: {
          columns: { id: true, name: true, icon: true, iconPlaceholder: true },
        },
      },
    });

    return c.json(data, 200);
  })
  .get("/moderated", mwAuthenticated, async (c) => {
    const data = await c.var.db.query.usersToCommunities.findMany({
      where: (userToCommunity, { and, eq, exists }) =>
        exists(
          c.var.db
            .select({ id: communities.id })
            .from(communities)
            .where(
              and(
                eq(communities.moderatorId, c.var.currentUserId),
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

    return c.json(data, 200);
  })
  .get("/muted", mwAuthenticated, async (c) => {
    const data = await c.var.db.query.usersToCommunities.findMany({
      where: (userToCommunity, { and, eq }) =>
        and(
          eq(userToCommunity.userId, c.var.currentUserId),
          eq(userToCommunity.muted, true),
        ),
      columns: { favorited: true, favoritedAt: true },
      with: {
        community: {
          columns: { id: true, name: true, icon: true, iconPlaceholder: true },
        },
      },
    });

    return c.json(data, 200);
  })
  .patch(
    `/:communityId{${reg}}/favorite`,
    validator("json", (value, c) => {
      const parsed = UserToCommunitySchema.pick({
        favorited: true,
      }).safeParse(value);

      if (!parsed.success) {
        return c.text(
          `400 Invalid query parameter for ${parsed.error.name}`,
          400,
        );
      }
      return parsed.data;
    }),
    mwAuthenticated,
    async (c) => {
      const communityId = c.req.param("communityId");
      const json = c.req.valid("json");

      const newDate = new Date().toISOString();

      const data = await c.var.db
        .insert(usersToCommunities)
        .values({
          communityId,
          userId: c.var.currentUserId,
          favoritedAt: newDate,
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { favorited: json.favorited, favoritedAt: newDate },
        })
        .returning({ favorited: usersToCommunities.favorited });

      return c.json(data, 200);
    },
  )
  .patch(
    `/:communityId{${reg}}/join`,
    validator("json", (value, c) => {
      const parsed = UserToCommunitySchema.pick({
        joined: true,
      }).safeParse(value);

      if (!parsed.success) {
        return c.text(
          `400 Invalid query parameter for ${parsed.error.name}`,
          400,
        );
      }
      return parsed.data;
    }),
    mwAuthenticated,
    async (c) => {
      const communityId = c.req.param("communityId");
      const json = c.req.valid("json");

      const newDate = new Date().toISOString();

      const data = await c.var.db
        .insert(usersToCommunities)
        .values({
          communityId,
          userId: c.var.currentUserId,
          joinedAt: newDate,
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { joined: json.joined, joinedAt: newDate },
        })
        .returning({ joined: usersToCommunities.joined });

      return c.json(data, 200);
    },
  )
  .patch(
    `/:communityId{${reg}}/mute`,
    validator("json", (value, c) => {
      const parsed = UserToCommunitySchema.pick({
        muted: true,
      }).safeParse(value);

      if (!parsed.success) {
        return c.text(
          `400 Invalid query parameter for ${parsed.error.name}`,
          400,
        );
      }
      return parsed.data;
    }),
    mwAuthenticated,
    async (c) => {
      const communityId = c.req.param("communityId");
      const json = c.req.valid("json");

      const data = await c.var.db
        .insert(usersToCommunities)
        .values({
          communityId,
          userId: c.var.currentUserId,
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { muted: json.muted },
        })
        .returning({ muted: usersToCommunities.muted });

      return c.json(data, 200);
    },
  );
