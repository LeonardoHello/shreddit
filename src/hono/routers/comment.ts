import { and, eq, exists, or } from "drizzle-orm";
import { validator } from "hono/validator";
import * as z from "zod/mini";

import { comments, CommentSchema } from "@/db/schema/comments";
import { communities, CommunitySchema } from "@/db/schema/communities";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory, mwAuthenticated } from "../init";

// eslint-disable-next-line drizzle/enforce-delete-with-where
export const comment = factory
  .createApp()
  .post(
    "/",
    validator("query", (value, c) => {
      const parsed = z
        .object({
          postId: CommentSchema.shape.postId,
          parentCommentId: z.optional(CommentSchema.shape.parentCommentId),
        })
        .safeParse(value);

      if (!parsed.success) {
        const error = parsed.error._zod.def[0];
        return c.text(
          `400 Invalid query parameter for ${error.path}. ${error.message}`,
          400,
        );
      }
      return parsed.data;
    }),
    validator("json", (value, c) => {
      const parsed = CommentSchema.pick({ text: true }).safeParse(value);

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
