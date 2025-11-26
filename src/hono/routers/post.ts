import { and, eq, exists, or } from "drizzle-orm";
import { validator } from "hono/validator";
import { v4 as uuidv4 } from "uuid";
import * as v from "valibot";

import { UserToComment } from "@/db/schema/comments";
import { communities } from "@/db/schema/communities";
import {
  postFiles,
  PostFileSchema,
  posts,
  PostSchema,
} from "@/db/schema/posts";
import { PostFeed } from "@/types/enums";
import {
  feedHonoResponse,
  feedHonoValidation,
  postInputConfig,
} from "@/utils/feedQueryOptions";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory } from "../init";

// eslint-disable-next-line drizzle/enforce-delete-with-where
export const post = factory
  .createApp()
  .get("/", feedHonoValidation, async (c) => {
    const query = c.req.valid("query");

    return feedHonoResponse(c, query, { feed: PostFeed.ALL });
  })
  .get(`/:postId{${reg}}`, async (c) => {
    const postId = c.req.param("postId");
    const currentUserId = c.get("currentUserId");
    const db = c.get("db");

    const inputConfig = postInputConfig(currentUserId);

    const data = await db.query.posts.findFirst({
      ...inputConfig,
      where: (post, { eq }) => eq(post.id, postId),
    });

    return c.json(data ?? null, 200);
  })
  .get(`/:postId{${reg}}/comments`, async (c) => {
    const postId = c.req.param("postId");
    const db = c.get("db");

    const data = await db.query.comments.findMany({
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
              ), 0)::int
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
    validator("json", (value, c) => {
      const parsed = v.safeParse(
        v.object({
          ...v.omit(PostSchema, ["id", "createdAt", "updatedAt", "authorId"])
            .entries,
          files: v.optional(
            v.array(
              v.pick(PostFileSchema, ["key", "url", "name", "thumbHash"]),
            ),
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

      const { files, ...post } = c.req.valid("json");
      const db = c.get("db");

      let data;

      if (!files) {
        data = await db
          .insert(posts)
          .values({ ...post, authorId: currentUserId })
          .returning({ id: posts.id });
      } else {
        const postId = uuidv4();

        data = await db.batch([
          db
            .insert(posts)
            .values({
              ...post,
              text: null,
              id: postId,
              authorId: currentUserId,
            })
            .returning({ id: posts.id }),
          db
            .insert(postFiles)
            .values(files.map((file) => ({ ...file, postId }))),
        ]);

        data = data[0];
      }

      return c.json(data, 201);
    },
  )
  .patch(
    `/:postId{${reg}}`,
    validator("json", (value, c) => {
      const parsed = v.safeParse(v.pick(PostSchema, ["text"]), value);

      if (!parsed.success) {
        const error = parsed.issues[0];
        return c.text(`400 ${error.message}`, 400);
      }

      return parsed.output;
    }),
    async (c) => {
      const currentUserId = c.get("currentUserId");

      if (!currentUserId) return c.text("401 unauthorized", 401);

      const postId = c.req.param("postId");
      const json = c.req.valid("json");
      const db = c.get("db");

      await db
        .update(posts)
        .set({ ...json })
        .where(and(eq(posts.id, postId), eq(posts.authorId, currentUserId)));

      c.text("success", 200);
    },
  )
  .delete(`/:postId{${reg}}`, async (c) => {
    const currentUserId = c.get("currentUserId");

    if (!currentUserId) return c.text("401 unauthorized", 401);

    const postId = c.req.param("postId");
    const db = c.get("db");

    await db.delete(posts).where(
      and(
        eq(posts.id, postId),
        or(
          eq(posts.authorId, currentUserId),
          exists(
            db
              .select({ moderatorId: communities.moderatorId })
              .from(communities)
              .where(
                and(
                  eq(communities.id, posts.communityId),
                  eq(communities.moderatorId, currentUserId),
                ),
              ),
          ),
        ),
      ),
    );

    return c.text("success", 200);
  });
