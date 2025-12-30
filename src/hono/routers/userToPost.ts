import { and, eq, exists, or } from "drizzle-orm";
import { validator } from "hono/validator";
import * as v from "valibot";

import { communities } from "@/db/schema/communities";
import {
  posts,
  PostSchema,
  usersToPosts,
  UserToPostSchema,
} from "@/db/schema/posts";
import { PostFeed } from "@/types/enums";
import { feedHonoResponse, feedHonoValidation } from "@/utils/feedQueryOptions";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory } from "../init";

export const userToPost = factory
  .createApp()
  .get("/", feedHonoValidation, async (c) => {
    const currentUserId = c.get("currentUserId");

    if (!currentUserId) return c.text("401 unauthorized", 401);

    const query = c.req.valid("query");

    return feedHonoResponse(c, query, { feed: PostFeed.HOME });
  })
  .get(`/:postId{${reg}}`, async (c) => {
    const currentUserId = c.get("currentUserId");

    if (!currentUserId) return c.text("401 unauthorized", 401);

    const postId = c.req.param("postId");
    const db = c.get("db");

    const data = await db.query.usersToPosts.findFirst({
      where: (userToPost, { and, eq }) =>
        and(
          eq(userToPost.userId, currentUserId),
          eq(userToPost.postId, postId),
        ),
      columns: { userId: false, postId: false, createdAt: false },
    });

    return c.json(data ?? null, 200);
  })
  .patch(
    `/:postId{${reg}}/vote`,
    validator("json", (value, c) => {
      const parsed = v.safeParse(
        v.object({
          voteStatus: UserToPostSchema.entries.voteStatus,
          voteCount: v.pipe(v.number(), v.integer()),
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

      const postId = c.req.param("postId");
      const { voteStatus, voteCount } = c.req.valid("json");
      const db = c.get("db");

      await db.batch([
        db
          .insert(usersToPosts)
          .values({ postId, userId: currentUserId, voteStatus })
          .onConflictDoUpdate({
            target: [usersToPosts.userId, usersToPosts.postId],
            set: { voteStatus },
          }),
        db.update(posts).set({ voteCount }).where(eq(posts.id, postId)),
      ]);

      return c.text("success", 200);
    },
  )
  .patch(
    `/:postId{${reg}}/save`,
    validator("json", (value, c) => {
      const parsed = v.safeParse(v.pick(UserToPostSchema, ["saved"]), value);

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

      const data = await db
        .insert(usersToPosts)
        .values({ postId, userId: currentUserId, ...json })
        .onConflictDoUpdate({
          target: [usersToPosts.userId, usersToPosts.postId],
          set: json,
        })
        .returning({ saved: usersToPosts.saved });

      return c.json(data, 200);
    },
  )
  .patch(
    `/:postId{${reg}}/hide`,
    validator("json", (value, c) => {
      const parsed = v.safeParse(v.pick(UserToPostSchema, ["hidden"]), value);

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

      const data = await db
        .insert(usersToPosts)
        .values({ postId, userId: currentUserId, ...json })
        .onConflictDoUpdate({
          target: [usersToPosts.userId, usersToPosts.postId],
          set: json,
        })
        .returning({ hidden: usersToPosts.hidden });

      return c.json(data, 200);
    },
  )
  .patch(
    `/:postId{${reg}}/spoiler`,
    validator("json", (value, c) => {
      const parsed = v.safeParse(v.pick(PostSchema, ["spoiler"]), value);

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

      const data = await db
        .update(posts)
        .set({ spoiler: json.spoiler, updatedAt: new Date().toISOString() })
        .where(
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
        )
        .returning({ spoiler: posts.spoiler });

      return c.json(data, 200);
    },
  )
  .patch(
    `/:postId{${reg}}/nsfw`,
    validator("json", (value, c) => {
      const parsed = v.safeParse(v.pick(PostSchema, ["nsfw"]), value);

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

      const data = await db
        .update(posts)
        .set({ nsfw: json.nsfw, updatedAt: new Date().toISOString() })
        .where(
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
        )
        .returning({ nsfw: posts.nsfw });

      return c.json(data, 200);
    },
  );
