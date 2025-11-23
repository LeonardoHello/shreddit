import { and, eq } from "drizzle-orm";
import { validator } from "hono/validator";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod/mini";

import {
  communities,
  CommunitySchema,
  usersToCommunities,
} from "@/db/schema/communities";
import { getOneMonthAgo } from "@/utils/getOneMonthAgo";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory, mwAuthenticated } from "../init";

// eslint-disable-next-line drizzle/enforce-delete-with-where
export const community = factory
  .createApp()
  .get(
    "/search",
    validator("query", (value, c) => {
      const parsed = z
        .object({
          search: z.string(),
          limit: z.string(),
        })
        .safeParse(value);

      if (!parsed.success) {
        const error = parsed.error._zod.def[0];
        return c.text(
          `400 Invalid query parameter for ${error.path}. ${error.message}`,
          400,
        );
      }

      const transformed = z
        .object({
          search: z.string(),
          limit: z.number().check(z.positive()),
        })
        .safeParse({ ...parsed.data, limit: Number(parsed.data.limit) });

      if (!transformed.success) {
        return c.text(
          `400 Invalid query parameter for limit. Not of type number`,
          400,
        );
      }

      return transformed.data;
    }),
    async (c) => {
      const query = c.req.valid("query");

      const data = await c.var.db.query.communities.findMany({
        limit: query.limit,
        where: (community, { ilike }) =>
          ilike(community.name, `%${query.search}%`),
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
  .get("/:communityName", async (c) => {
    const communityName = c.req.param("communityName");

    const data = await c.var.db.query.communities.findFirst({
      where: (community, { eq }) => eq(community.name, communityName),
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
                AND users_to_communities.joined_at > ${getOneMonthAgo()}
            )
          `.as("new_member_count"),
      }),
    });

    return c.json(data, 200);
  })
  .get("/:communityName/icon", mwAuthenticated, async (c) => {
    const communityName = c.req.param("communityName");

    const data = await c.var.db.query.communities.findFirst({
      where: (community, { eq }) => eq(community.name, communityName),
      columns: { id: true, name: true, icon: true, iconPlaceholder: true },
    });

    return c.json(data, 200);
  })
  .get("/:communityName/submit", mwAuthenticated, async (c) => {
    const communityName = c.req.param("communityName");

    const data = await c.var.db.query.communities.findFirst({
      where: (community, { eq }) => eq(community.name, communityName),
      columns: { id: true, name: true, icon: true, iconPlaceholder: true },
    });

    return c.json(data, 200);
  })

  .post(
    "/",
    validator("json", (value, c) => {
      const parsed = CommunitySchema.pick({
        name: true,
        description: true,
        icon: true,
        iconPlaceholder: true,
        banner: true,
        bannerPlaceholder: true,
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
    mwAuthenticated,
    async (c) => {
      const json = c.req.valid("json");

      const communityId = uuidv4();

      const data = await c.var.db.batch([
        c.var.db
          .insert(communities)
          .values({
            id: communityId,
            moderatorId: c.var.currentUserId,
            ...json,
          })
          .returning({ name: communities.name }),
        c.var.db.insert(usersToCommunities).values({
          userId: c.var.currentUserId,
          communityId,
        }),
      ]);

      return c.json(data, 201);
    },
  )
  .patch(
    `/:communityId{${reg}}`,
    validator("json", (value, c) => {
      const parsed = CommunitySchema.omit({
        id: true,
        updatedAt: true,
        createdAt: true,
        name: true,
        moderatorId: true,
      }).safeParse(value);

      if (!parsed.success) {
        const error = parsed.error._zod.def[0];
        return c.text(
          `400 Invalid query parameter for ${error.path}. ${error.message}`,
          400,
        );
      }
      return parsed.data;
    }),
    mwAuthenticated,
    async (c) => {
      const communityId = c.req.param("communityId");
      const json = c.req.valid("json");

      await c.var.db
        .update(communities)
        .set({ ...json })
        .where(
          and(
            eq(communities.moderatorId, c.var.currentUserId),
            eq(communities.id, communityId),
          ),
        );

      return c.status(204);
    },
  )
  .delete(`/:communityId{${reg}}`, mwAuthenticated, async (c) => {
    const communityId = c.req.param("communityId");

    await c.var.db
      .delete(communities)
      .where(
        and(
          eq(communities.moderatorId, c.var.currentUserId),
          eq(communities.id, communityId),
        ),
      );

    return c.status(204);
  });
