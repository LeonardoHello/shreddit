import { validator } from "hono/validator";
import * as z from "zod/mini";

import { factory } from "../init";

const searchSchema = z.object({
  search: z.string(),
});

export const user = factory.createApp().get(
  "/search",
  validator("query", (value, c) => {
    const parsed = searchSchema.safeParse(value);
    if (!parsed.success) {
      return c.text("400 Invalid search query", 400);
    }
    return parsed.data;
  }),
  async (c) => {
    const { search } = c.req.valid("query");
    const data = await c.var.db.query.users.findMany({
      limit: 4,
      columns: { username: true, image: true },
      where: (user, { ilike }) => ilike(user.username, `%${search}%`),
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
);
