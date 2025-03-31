import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { UserSchema } from "@/db/schema/users";
import { baseProcedure, createTRPCRouter } from "../init";

export const userRouter = createTRPCRouter({
  getUserByName: baseProcedure
    .input(UserSchema.shape.username)
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (user, { eq }) => eq(user.username, input),
        with: {
          communities: {
            columns: { id: true, icon: true, name: true },
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

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "The user you are looking for doesn't exist or has deleted their account.",
        });

      return user;
    }),
  searchUsers: baseProcedure.input(z.string()).query(({ input, ctx }) => {
    return ctx.db.query.users.findMany({
      limit: 4,
      columns: { username: true, imageUrl: true },
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
