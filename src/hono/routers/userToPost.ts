import { and, eq, exists, or } from "drizzle-orm";
import { validator } from "hono/validator";

import { communities } from "@/db/schema/communities";
import {
  posts,
  PostSchema,
  usersToPosts,
  UserToPostSchema,
} from "@/db/schema/posts";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import { factory, mwAuthenticated } from "../init";

export const userToPost = factory
  .createApp()
  .patch(
    `/:postId{${reg}}/vote`,
    validator("json", (value, c) => {
      const parsed = UserToPostSchema.pick({
        voteStatus: true,
      }).safeParse(value);

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
      const postId = c.req.param("postId");
      const json = c.req.valid("json");

      const data = await c.var.db
        .insert(usersToPosts)
        .values({ postId, userId: c.var.currentUserId, ...json })
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
        return c.text("400 Invalid search json", 400);
      }
      return parsed.data;
    }),
    mwAuthenticated,
    async (c) => {
      const postId = c.req.param("postId");
      const json = c.req.valid("json");

      const data = await c.var.db
        .insert(usersToPosts)
        .values({ postId, userId: c.var.currentUserId, ...json })
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
        return c.text("400 Invalid search json", 400);
      }
      return parsed.data;
    }),
    mwAuthenticated,
    async (c) => {
      const postId = c.req.param("postId");
      const json = c.req.valid("json");

      const data = await c.var.db
        .insert(usersToPosts)
        .values({ postId, userId: c.var.currentUserId, ...json })
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
        return c.text(
          `400 Invalid query parameter for ${parsed.error.name}`,
          400,
        );
      }
      return parsed.data;
    }),
    mwAuthenticated,
    async (c) => {
      const postId = c.req.param("postId");
      const json = c.req.valid("json");

      const data = await c.var.db
        .update(posts)
        .set({ spoiler: json.spoiler, updatedAt: new Date() })
        .where(
          and(
            eq(posts.id, postId),
            or(
              eq(posts.authorId, c.var.currentUserId),
              exists(
                c.var.db
                  .select({ moderatorId: communities.moderatorId })
                  .from(communities)
                  .where(
                    and(
                      eq(communities.id, posts.communityId),
                      eq(communities.moderatorId, c.var.currentUserId),
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
        return c.text("400 Invalid search json", 400);
      }
      return parsed.data;
    }),
    mwAuthenticated,
    async (c) => {
      const postId = c.req.param("postId");
      const json = c.req.valid("json");

      const data = await c.var.db
        .update(posts)
        .set({ nsfw: json.nsfw, updatedAt: new Date() })
        .where(
          and(
            eq(posts.id, postId),
            or(
              eq(posts.authorId, c.var.currentUserId),
              exists(
                c.var.db
                  .select({ moderatorId: communities.moderatorId })
                  .from(communities)
                  .where(
                    and(
                      eq(communities.id, posts.communityId),
                      eq(communities.moderatorId, c.var.currentUserId),
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
