import { z } from "zod/v4";

import { UserSchema } from "@/db/schema/users";
import { baseProcedure, createTRPCRouter } from "../init";

export const userRouter = createTRPCRouter({
  getUserByName: baseProcedure
    .input(UserSchema.shape.username.unwrap())
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (user, { eq }) => eq(user.username, input),
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

      return user ?? null;
    }),
  searchUsers: baseProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.db.query.users.findMany({
      limit: 4,
      columns: { username: true, image: true },
      where: (user, { ilike }) => ilike(user.username, `%${input}%`),
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
  }),
});
