import { and, eq, exists, or } from "drizzle-orm";
import { validator } from "hono/validator";
import * as z from "zod/mini";

import { comments, CommentSchema } from "@/db/schema/comments";
import { communities, CommunitySchema } from "@/db/schema/communities";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory } from "../init";

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
    async (c) => {
      const currentUserId = c.get("currentUserId");

      if (!currentUserId) return c.text("401 unauthorized", 401);

      const query = c.req.valid("query");
      const json = c.req.valid("json");
      const db = c.get("db");

      const data = await db
        .insert(comments)
        .values({
          authorId: currentUserId,
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
    async (c) => {
      const currentUserId = c.get("currentUserId");

      if (!currentUserId) return c.text("401 unauthorized", 401);

      const commentId = c.req.param("commentId");
      const query = c.req.valid("json");
      const db = c.get("db");

      const data = await db
        .update(comments)
        .set({ text: query.text, updatedAt: new Date().toISOString() })
        .where(
          and(eq(comments.id, commentId), eq(comments.authorId, currentUserId)),
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
    async (c) => {
      const currentUserId = c.get("currentUserId");

      if (!currentUserId) return c.text("401 unauthorized", 401);

      const commentId = c.req.param("commentId");
      const query = c.req.valid("query");
      const db = c.get("db");

      const data = await db
        .delete(comments)
        .where(
          and(
            eq(comments.id, commentId),
            or(
              eq(comments.authorId, currentUserId),
              exists(
                db
                  .select({ id: communities.id })
                  .from(communities)
                  .where(
                    and(
                      eq(communities.id, query.communityId),
                      eq(communities.moderatorId, currentUserId),
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
