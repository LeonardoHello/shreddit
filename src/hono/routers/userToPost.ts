import { and, eq, exists, or } from "drizzle-orm";
import { validator } from "hono/validator";

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
    const query = c.req.valid("query");

    if (!query.currentUserId) return c.text("401 unauthorized", 401);

    return feedHonoResponse(c, query, c.var, {
      feed: PostFeed.HOME,
      currentUserId: query.currentUserId,
    });
  })
  .patch(
    `/:postId{${reg}}/vote`,
    validator("json", (value, c) => {
      const parsed = UserToPostSchema.pick({
        voteStatus: true,
      }).safeParse(value);

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

      const postId = c.req.param("postId");
      const json = c.req.valid("json");
      const db = c.get("db");

      const data = await db
        .insert(usersToPosts)
        .values({ postId, userId: currentUserId, ...json })
        .onConflictDoUpdate({
          target: [usersToPosts.userId, usersToPosts.postId],
          set: { voteStatus: json.voteStatus },
        })
        .returning();

      return c.json(data, 200);
    },
  )
  .patch(
    `/:postId{${reg}}/save`,
    validator("json", (value, c) => {
      const parsed = UserToPostSchema.pick({ saved: true }).safeParse(value);

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

      const postId = c.req.param("postId");
      const json = c.req.valid("json");
      const db = c.get("db");

      const data = await db
        .insert(usersToPosts)
        .values({ postId, userId: currentUserId, ...json })
        .onConflictDoUpdate({
          target: [usersToPosts.userId, usersToPosts.postId],
          set: { saved: json.saved },
        })
        .returning({ saved: usersToPosts.saved });

      return c.json(data, 200);
    },
  )
  .patch(
    `/:postId{${reg}}/hide`,
    validator("json", (value, c) => {
      const parsed = UserToPostSchema.pick({ hidden: true }).safeParse(value);

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

      const postId = c.req.param("postId");
      const json = c.req.valid("json");
      const db = c.get("db");

      const data = await db
        .insert(usersToPosts)
        .values({ postId, userId: currentUserId, ...json })
        .onConflictDoUpdate({
          target: [usersToPosts.userId, usersToPosts.postId],
          set: { hidden: json.hidden },
        })
        .returning({ hidden: usersToPosts.hidden });

      return c.json(data, 200);
    },
  )
  .patch(
    `/:postId{${reg}}/spoiler`,
    validator("json", (value, c) => {
      const parsed = PostSchema.pick({ spoiler: true }).safeParse(value);

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
      const parsed = PostSchema.pick({ nsfw: true }).safeParse(value);

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
