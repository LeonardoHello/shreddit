import { validator } from "hono/validator";
import * as z from "zod/mini";

import { factory } from "../init";

export const user = factory
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

      const data = await c.var.db.query.users.findMany({
        limit: query.limit,
        columns: { username: true, image: true },
        where: (user, { ilike }) => ilike(user.username, `%${query.search}%`),
        extras: (user, { sql }) => ({
          onionCount: sql<number>`
            (
              SELECT COALESCE(SUM(
                CASE 
                  WHEN vote_status = 'upvoted' THEN 1
                  WHEN vote_status = 'downvoted' THEN -1
                  ELSE 0
                END
              ), 0)
              FROM users_to_posts
              WHERE users_to_posts.user_id = ${user.id}
            ) + 
            (
              SELECT COALESCE(SUM(
                CASE 
                  WHEN vote_status = 'upvoted' THEN 1
                  WHEN vote_status = 'downvoted' THEN -1
                  ELSE 0
                END
              ), 0)
              FROM users_to_comments
              WHERE users_to_comments.user_id = ${user.id}
            ) + 
            (
              SELECT COUNT(*) 
              FROM users_to_communities
              WHERE users_to_communities.user_id = ${user.id}
                AND users_to_communities.joined = true
            )
          `.as("onion_count"),
        }),
      });

      return c.json(data, 200);
    },
  )
  .get("/:username", async (c) => {
    const username = c.req.param("username");

    const user = await c.var.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.username, username),
      with: {
        communities: {
          columns: {
            id: true,
            icon: true,
            name: true,
            iconPlaceholder: true,
          },
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
        },
      },
      extras: (user, { sql }) => ({
        onionCount: sql<number>`
            (
              SELECT COALESCE(SUM(
                CASE 
                  WHEN vote_status = 'upvoted' THEN 1
                  WHEN vote_status = 'downvoted' THEN -1
                  ELSE 0
                END
              ), 0)
              FROM users_to_posts
              WHERE users_to_posts.user_id = ${user.id}
            ) + 
            (
              SELECT COALESCE(SUM(
                CASE 
                  WHEN vote_status = 'upvoted' THEN 1
                  WHEN vote_status = 'downvoted' THEN -1
                  ELSE 0
                END
              ), 0)
              FROM users_to_comments
              WHERE users_to_comments.user_id = ${user.id}
            ) + 
            (
              SELECT COUNT(*) 
              FROM users_to_communities
              WHERE users_to_communities.user_id = ${user.id}
                AND users_to_communities.joined = true
            )
          `.as("onion_count"),
      }),
    });

    return c.json(user, 200);
  });
