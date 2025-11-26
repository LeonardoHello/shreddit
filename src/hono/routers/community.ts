import { and, eq } from "drizzle-orm";
import { validator } from "hono/validator";
import { v4 as uuidv4 } from "uuid";
import * as v from "valibot";

import {
  communities,
  CommunitySchema,
  usersToCommunities,
} from "@/db/schema/communities";
import { PostFeed } from "@/types/enums";
import { feedHonoResponse, feedHonoValidation } from "@/utils/feedQueryOptions";
import { getOneMonthAgo } from "@/utils/getOneMonthAgo";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory } from "../init";

// eslint-disable-next-line drizzle/enforce-delete-with-where
export const community = factory
  .createApp()
  .get(
    "/search",
    validator("query", (value, c) => {
      const parsed = v.safeParse(
        v.object({
          search: v.string(),
          limit: v.string(),
        }),
        value,
      );

      if (!parsed.success) {
        const error = parsed.issues[0];
        return c.text(`400 ${error.message}`, 400);
      }

      const transformed = v.safeParse(
        v.object({
          search: v.string(),
          limit: v.pipe(v.number(), v.integer(), v.gtValue(0)),
        }),
        { ...parsed.output, limit: Number(parsed.output.limit) },
      );

      if (!transformed.success) {
        const error = transformed.issues[0];
        return c.text(`400 ${error.message}`, 400);
      }

      return transformed.output;
    }),
    async (c) => {
      const query = c.req.valid("query");
      const db = c.get("db");

      const data = await db.query.communities.findMany({
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
    const db = c.get("db");

    const data = await db.query.communities.findFirst({
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
  .get("/:communityName/icon", async (c) => {
    const currentUserId = c.get("currentUserId");

    if (!currentUserId) return c.text("401 unauthorized", 401);

    const communityName = c.req.param("communityName");
    const db = c.get("db");

    const data = await db.query.communities.findFirst({
      where: (community, { eq }) => eq(community.name, communityName),
      columns: { icon: true },
    });

    return c.json(data, 200);
  })
  .get("/:communityName/submit", async (c) => {
    const currentUserId = c.get("currentUserId");

    if (!currentUserId) return c.text("401 unauthorized", 401);

    const communityName = c.req.param("communityName");
    const db = c.get("db");

    const data = await db.query.communities.findFirst({
      where: (community, { eq }) => eq(community.name, communityName),
      columns: { id: true, name: true, icon: true, iconPlaceholder: true },
    });

    return c.json(data, 200);
  })
  .get("/:communityName/posts", feedHonoValidation, async (c) => {
    const communityName = c.req.param("communityName");
    const query = c.req.valid("query");

    return feedHonoResponse(c, query, {
      feed: PostFeed.COMMUNITY,
      communityName,
    });
  })
  .post(
    "/",
    validator("json", (value, c) => {
      const parsed = v.safeParse(
        v.pick(CommunitySchema, [
          "name",
          "description",
          "icon",
          "iconPlaceholder",
          "banner",
          "bannerPlaceholder",
        ]),
        value,
      );

      if (!parsed.success) {
        const error = parsed.issues[0];
        return c.text(`400 ${error.message}`, 400);
      }

      return parsed.output;
    }),
    async (c) => {
      const currentUserId = c.get("currentUserId");

      if (!currentUserId) return c.text("401 unauthorized", 401);

      const json = c.req.valid("json");
      const db = c.get("db");

      const communityId = uuidv4();

      const data = await db.batch([
        db
          .insert(communities)
          .values({
            id: communityId,
            moderatorId: currentUserId,
            ...json,
          })
          .returning({ name: communities.name }),
        db.insert(usersToCommunities).values({
          userId: currentUserId,
          communityId,
        }),
      ]);

      return c.json(data, 201);
    },
  )
  .patch(
    `/:communityId{${reg}}`,
    validator("json", (value, c) => {
      const parsed = v.safeParse(
        v.omit(CommunitySchema, [
          "id",
          "updatedAt",
          "createdAt",
          "name",
          "moderatorId",
        ]),
        value,
      );

      if (!parsed.success) {
        const error = parsed.issues[0];
        return c.text(`400 ${error.message}`, 400);
      }

      return parsed.output;
    }),
    async (c) => {
      const currentUserId = c.get("currentUserId");

      if (!currentUserId) return c.text("401 unauthorized", 401);

      const communityId = c.req.param("communityId");
      const json = c.req.valid("json");
      const db = c.get("db");

      await db
        .update(communities)
        .set({ ...json })
        .where(
          and(
            eq(communities.moderatorId, currentUserId),
            eq(communities.id, communityId),
          ),
        );

      return c.text("success", 200);
    },
  )
  .delete(`/:communityId{${reg}}`, async (c) => {
    const currentUserId = c.get("currentUserId");

    if (!currentUserId) return c.text("401 unauthorized", 401);

    const communityId = c.req.param("communityId");
    const db = c.get("db");

    await db
      .delete(communities)
      .where(
        and(
          eq(communities.moderatorId, currentUserId),
          eq(communities.id, communityId),
        ),
      );

    return c.text("success", 200);
  });
