import { and, eq, exists, or } from "drizzle-orm";
import { validator } from "hono/validator";
import * as v from "valibot";

import { comments, CommentSchema } from "@/db/schema/comments";
import { communities, CommunitySchema } from "@/db/schema/communities";
import { posts, PostSchema } from "@/db/schema/posts";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory } from "../init";

// eslint-disable-next-line drizzle/enforce-delete-with-where
export const comment = factory
  .createApp()
  .post(
    "/",
    validator("query", (value, c) => {
      const parsed = v.safeParse(
        v.object({
          postId: CommentSchema.entries.postId,
          parentCommentId: v.optional(CommentSchema.entries.parentCommentId),
        }),
        value,
      );

      if (!parsed.success) {
        const error = parsed.issues[0];
        return c.text(`400 ${error.message}`, 400);
      }

      return parsed.output;
    }),
    validator("json", (value, c) => {
      const parsed = v.safeParse(v.pick(CommentSchema, ["text"]), value);

      if (!parsed.success) {
        const error = parsed.issues[0];
        return c.text(`400 ${error.message}`, 400);
      }

      return parsed.output;
    }),
    async (c) => {
      const currentUserId = c.get("currentUserId");

      if (!currentUserId) return c.text("401 unauthorized", 401);

      const query = c.req.valid("query");
      const json = c.req.valid("json");
      const db = c.get("db");

      const post = await db.query.posts.findFirst({
        columns: { commentCount: true },
        where: (post, { eq }) => eq(post.id, query.postId),
      });

      const commentCount = post ? post.commentCount + 1 : 1;

      const data = await db.batch([
        db
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
          .returning(),
        db
          .update(posts)
          .set({ commentCount })
          .where(eq(posts.id, query.postId)),
      ]);

      return c.json(data[0], 201);
    },
  )
  .patch(
    `/:commentId{${reg}}`,
    validator("json", (value, c) => {
      const parsed = v.safeParse(v.pick(CommentSchema, ["text"]), value);

      if (!parsed.success) {
        const error = parsed.issues[0];
        return c.text(`400 ${error.message}`, 400);
      }

      return parsed.output;
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
      const parsed = v.safeParse(
        v.object({
          postId: v.pipe(PostSchema.entries.id, v.uuid()),
          communityId: v.pipe(CommunitySchema.entries.id, v.uuid()),
        }),
        value,
      );

      if (!parsed.success) {
        const error = parsed.issues[0];
        return c.text(`400 ${error.message}`, 400);
      }

      return parsed.output;
    }),
    validator("json", (value, c) => {
      const parsed = v.safeParse(
        v.object({
          commentCount: v.pipe(
            PostSchema.entries.commentCount,
            v.integer(),
            v.minValue(0),
          ),
        }),
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

      const commentId = c.req.param("commentId");
      const query = c.req.valid("query");
      const json = c.req.valid("json");
      const db = c.get("db");

      const data = await db.batch([
        db
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
          .returning({ id: comments.id }),
        db
          .update(posts)
          .set({ commentCount: json.commentCount })
          .where(eq(posts.id, query.postId)),
      ]);

      return c.json(data[0], 200);
    },
  );
