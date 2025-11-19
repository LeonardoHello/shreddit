import { and, eq, exists, or } from "drizzle-orm";
import { validator } from "hono/validator";
import z from "zod";

import { comments, CommentSchema, UserToComment } from "@/db/schema/comments";
import { communities, CommunitySchema } from "@/db/schema/communities";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory, mwAuthenticated } from "../init";

// eslint-disable-next-line drizzle/enforce-delete-with-where
export const comment = factory
  .createApp()
  .get(`/:postId{${reg}}`, async (c) => {
    const postId = c.req.param("postId");

    const data = await c.var.db.query.comments.findMany({
      where: (comment, { eq }) => eq(comment.postId, postId),
      with: {
        author: true,
        post: {
          columns: { authorId: true, communityId: true },
          with: { community: { columns: { moderatorId: true } } },
        },
      },
      extras: (comment, { sql }) => ({
        voteCount: sql<number>`
          (
            SELECT COALESCE(SUM(
              CASE 
                WHEN vote_status = 'upvoted' THEN 1
                WHEN vote_status = 'downvoted' THEN -1
                ELSE 0
              END
            ), 0)
            FROM users_to_comments
            WHERE users_to_comments.comment_id = ${comment.id}
          )
        `.as("vote_count"),
        voteStatus: sql<UserToComment["voteStatus"] | null>`
          (
            SELECT vote_status
            FROM users_to_comments
            WHERE users_to_comments.comment_id = ${comment.id}
              AND users_to_comments.user_id = ${c.var.currentUserId}
          )
        `.as("vote_status"),
      }),
      orderBy: (post, { desc }) => desc(post.createdAt),
    });

    return c.json(data, 200);
  })
  .post(
    "/",
    validator("query", (value, c) => {
      const parsed = CommentSchema.pick({
        postId: true,
        parentCommentId: true,
      }).safeParse(value);

      if (!parsed.success) {
        return c.text(
          `400 Invalid query parameter for ${parsed.error.name}`,
          400,
        );
      }
      return parsed.data;
    }),
    validator("json", (value, c) => {
      const parsed = CommentSchema.pick({ text: true }).safeParse(value);

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
      const query = c.req.valid("query");
      const json = c.req.valid("json");

      const data = await c.var.db
        .insert(comments)
        .values({
          authorId: c.var.currentUserId,
          ...query,
          ...json,
        })
        .onConflictDoUpdate({
          target: [comments.id],
          set: { text: json.text, updatedAt: new Date().toISOString() },
        })
        .returning();

      return c.json(data, 201);
    },
  )
  .patch(
    `/:commentId{${reg}}`,
    validator("json", (value, c) => {
      const parsed = CommentSchema.pick({ text: true }).safeParse(value);

      if (!parsed.success) {
        return c.text(`400 Invalid json for ${parsed.error.name}`, 400);
      }
      return parsed.data;
    }),
    mwAuthenticated,
    async (c) => {
      const commentId = c.req.param("commentId");
      const query = c.req.valid("json");

      const data = await c.var.db
        .update(comments)
        .set({ text: query.text, updatedAt: new Date().toISOString() })
        .where(
          and(
            eq(comments.id, commentId),
            eq(comments.authorId, c.var.currentUserId),
          ),
        )
        .returning();

      return c.json(data, 200);
    },
  )
  .delete(
    `/:commentId{${reg}}`,
    validator("query", (value, c) => {
      const parsed = z
        .object({ communityId: CommunitySchema.shape.id.check(z.uuidv4()) })
        .safeParse(value);

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
      const commentId = c.req.param("commentId");
      const query = c.req.valid("query");

      const data = await c.var.db
        .delete(comments)
        .where(
          and(
            eq(comments.id, commentId),
            or(
              eq(comments.authorId, c.var.currentUserId),
              exists(
                c.var.db
                  .select({ id: communities.id })
                  .from(communities)
                  .where(
                    and(
                      eq(communities.id, query.communityId),
                      eq(communities.moderatorId, c.var.currentUserId),
                    ),
                  ),
              ),
            ),
          ),
        )
        .returning({ id: comments.id });

      return c.json(data, 200);
    },
  );
