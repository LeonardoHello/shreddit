import { validator } from "hono/validator";
import * as z from "zod/mini";

import {
  communities,
  usersToCommunities,
  UserToCommunitySchema,
} from "@/db/schema/communities";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory } from "../init";

export const userToCommunity = factory
  .createApp()
  .get(
    "/joined",
    validator("query", (value, c) => {
      const parsed = z
        .object({
          currentUserId: z.string(),
        })
        .safeParse(value);

      if (!parsed.success) {
        const error = parsed.error._zod.def[0];
        return c.text(
          `400 Invalid json parameter for ${error.path}. ${error.message}`,
          400,
        );
      }
      return parsed.data;
    }),
    async (c) => {
      const query = c.req.valid("query");
      const db = c.get("db");

      const data = await db.query.usersToCommunities.findMany({
        where: (userToCommunity, { and, eq }) =>
          and(
            eq(userToCommunity.userId, query.currentUserId),
            eq(userToCommunity.joined, true),
          ),
        columns: { favorited: true, favoritedAt: true },
        with: {
          community: {
            columns: {
              id: true,
              name: true,
              icon: true,
              iconPlaceholder: true,
            },
          },
        },
      });

      return c.json(data, 200);
    },
  )
  .get(
    "/joined/submit",
    validator("query", (value, c) => {
      const parsed = z
        .object({
          currentUserId: z.string(),
        })
        .safeParse(value);

      if (!parsed.success) {
        const error = parsed.error._zod.def[0];
        return c.text(
          `400 Invalid json parameter for ${error.path}. ${error.message}`,
          400,
        );
      }
      return parsed.data;
    }),
    async (c) => {
      const query = c.req.valid("query");
      const db = c.get("db");

      const data = await db.query.communities.findMany({
        where: (community, { and, eq, exists }) =>
          exists(
            db
              .select()
              .from(usersToCommunities)
              .where(
                and(
                  eq(usersToCommunities.communityId, community.id),
                  eq(usersToCommunities.userId, query.currentUserId),
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
    },
  )
  .get(
    "/moderated",
    validator("query", (value, c) => {
      const parsed = z
        .object({
          currentUserId: z.string(),
        })
        .safeParse(value);

      if (!parsed.success) {
        const error = parsed.error._zod.def[0];
        return c.text(
          `400 Invalid json parameter for ${error.path}. ${error.message}`,
          400,
        );
      }
      return parsed.data;
    }),
    async (c) => {
      const query = c.req.valid("query");
      const db = c.get("db");

      const data = await db.query.usersToCommunities.findMany({
        where: (userToCommunity, { and, eq, exists }) =>
          exists(
            db
              .select({ id: communities.id })
              .from(communities)
              .where(
                and(
                  eq(communities.moderatorId, query.currentUserId),
                  eq(communities.moderatorId, userToCommunity.userId),
                  eq(communities.id, userToCommunity.communityId),
                ),
              ),
          ),
        columns: { favorited: true, favoritedAt: true },
        with: {
          community: {
            columns: {
              id: true,
              name: true,
              icon: true,
              iconPlaceholder: true,
            },
          },
        },
      });

      return c.json(data, 200);
    },
  )
  .get(
    "/muted",
    validator("query", (value, c) => {
      const parsed = z
        .object({
          currentUserId: z.string(),
        })
        .safeParse(value);

      if (!parsed.success) {
        const error = parsed.error._zod.def[0];
        return c.text(
          `400 Invalid json parameter for ${error.path}. ${error.message}`,
          400,
        );
      }
      return parsed.data;
    }),
    async (c) => {
      const query = c.req.valid("query");
      const db = c.get("db");

      const data = await db.query.usersToCommunities.findMany({
        where: (userToCommunity, { and, eq }) =>
          and(
            eq(userToCommunity.userId, query.currentUserId),
            eq(userToCommunity.muted, true),
          ),
        columns: { favorited: true, favoritedAt: true },
        with: {
          community: {
            columns: {
              id: true,
              name: true,
              icon: true,
              iconPlaceholder: true,
            },
          },
        },
      });

      return c.json(data, 200);
    },
  )
  .get(
    "/:communityName",
    validator("query", (value, c) => {
      const parsed = z
        .object({
          currentUserId: z.string(),
        })
        .safeParse(value);

      if (!parsed.success) {
        const error = parsed.error._zod.def[0];
        return c.text(
          `400 Invalid json parameter for ${error.path}. ${error.message}`,
          400,
        );
      }
      return parsed.data;
    }),
    async (c) => {
      const communityName = c.req.param("communityName");
      const query = c.req.valid("query");
      const db = c.get("db");

      const data = await db.query.usersToCommunities.findFirst({
        where: (userToCommunity, { and, eq, exists }) =>
          and(
            eq(userToCommunity.userId, query.currentUserId),
            exists(
              db
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

      return c.json(
        data ?? { favorited: false, joined: false, muted: false },
        200,
      );
    },
  )
  .patch(
    `/:communityId{${reg}}/favorite`,
    validator("json", (value, c) => {
      const parsed = UserToCommunitySchema.pick({
        favorited: true,
      }).safeParse(value);

      if (!parsed.success) {
        const error = parsed.error._zod.def[0];
        return c.text(
          `400 Invalid json parameter for ${error.path}. ${error.message}`,
          400,
        );
      }
      return parsed.data;
    }),
    async (c) => {
      const currentUserId = c.get("currentUserId");

      if (!currentUserId) return c.text("401 unauthorized", 401);

      const communityId = c.req.param("communityId");
      const json = c.req.valid("json");
      const db = c.get("db");

      const newDate = new Date().toISOString();

      const data = await db
        .insert(usersToCommunities)
        .values({
          communityId,
          userId: currentUserId,
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
        const error = parsed.error._zod.def[0];
        return c.text(
          `400 Invalid json parameter for ${error.path}. ${error.message}`,
          400,
        );
      }
      return parsed.data;
    }),
    async (c) => {
      const currentUserId = c.get("currentUserId");

      if (!currentUserId) return c.text("401 unauthorized", 401);

      const communityId = c.req.param("communityId");
      const json = c.req.valid("json");
      const db = c.get("db");

      const newDate = new Date().toISOString();

      const data = await db
        .insert(usersToCommunities)
        .values({
          communityId,
          userId: currentUserId,
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
        const error = parsed.error._zod.def[0];
        return c.text(
          `400 Invalid json parameter for ${error.path}. ${error.message}`,
          400,
        );
      }
      return parsed.data;
    }),

    async (c) => {
      const currentUserId = c.get("currentUserId");

      if (!currentUserId) return c.text("401 unauthorized", 401);

      const communityId = c.req.param("communityId");
      const json = c.req.valid("json");
      const db = c.get("db");

      const data = await db
        .insert(usersToCommunities)
        .values({
          communityId,
          userId: currentUserId,
        })
        .onConflictDoUpdate({
          target: [usersToCommunities.userId, usersToCommunities.communityId],
          set: { muted: json.muted },
        })
        .returning({ muted: usersToCommunities.muted });

      return c.json(data, 200);
    },
  );
