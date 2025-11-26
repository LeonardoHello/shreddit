import { validator } from "hono/validator";
import * as v from "valibot";

import { PostFeed } from "@/types/enums";
import { feedHonoResponse, feedHonoValidation } from "@/utils/feedQueryOptions";
import { factory } from "../init";

export const user = factory
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

      const data = await db.query.users.findMany({
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
    const db = c.get("db");

    const user = await db.query.users.findFirst({
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
  })
  .get("/:username/posts", feedHonoValidation, async (c) => {
    const username = c.req.param("username");
    const query = c.req.valid("query");

    return feedHonoResponse(c, query, { feed: PostFeed.USER, username });
  })
  .get("/:username/posts/upvoted", feedHonoValidation, async (c) => {
    const username = c.req.param("username");
    const query = c.req.valid("query");

    return feedHonoResponse(c, query, {
      feed: PostFeed.UPVOTED,
      username,
    });
  })
  .get("/:username/posts/downvoted", feedHonoValidation, async (c) => {
    const username = c.req.param("username");
    const query = c.req.valid("query");

    return feedHonoResponse(c, query, {
      feed: PostFeed.DOWNVOTED,
      username,
    });
  })
  .get("/:username/posts/saved", feedHonoValidation, async (c) => {
    const username = c.req.param("username");
    const query = c.req.valid("query");

    return feedHonoResponse(c, query, {
      feed: PostFeed.SAVED,
      username,
    });
  })
  .get("/:username/posts/hidden", feedHonoValidation, async (c) => {
    const username = c.req.param("username");
    const query = c.req.valid("query");

    return feedHonoResponse(c, query, {
      feed: PostFeed.HIDDEN,
      username,
    });
  });
