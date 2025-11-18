import { and, eq, exists, or } from "drizzle-orm";
import { validator } from "hono/validator";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod/mini";

import { communities } from "@/db/schema/communities";
import {
  postFiles,
  PostFileSchema,
  posts,
  PostSchema,
  UserToPost,
} from "@/db/schema/posts";
import { reg } from "@/utils/honoPathRegex";
import { factory, mwAuthenticated } from "../init";

// eslint-disable-next-line drizzle/enforce-delete-with-where
export const post = factory
  .createApp()
  .get(`/:postId{${reg}}`, async (c) => {
    const postId = c.req.param("postId");

    const data = await c.var.db.query.posts.findFirst({
      where: (post, { eq }) => eq(post.id, postId),
      with: {
        community: {
          columns: {
            name: true,
            icon: true,
            iconPlaceholder: true,
            moderatorId: true,
          },
        },
        author: { columns: { username: true, image: true } },
        files: {
          columns: { id: true, name: true, url: true, thumbHash: true },
        },
      },
      extras: (post, { sql }) => ({
        voteCount: sql<number>`
               (
                 SELECT COALESCE(SUM(
                   CASE 
                     WHEN vote_status = 'upvoted' THEN 1
                     WHEN vote_status = 'downvoted' THEN -1
                     ELSE 0
                   END
                 ), 0)
                 FROM users_to_posts
                 WHERE users_to_posts.post_id = ${post.id}
               )
             `.as("vote_count"),
        commentCount: sql<number>`
               (
                 SELECT COUNT(*)
                 FROM comments
                 WHERE comments.post_id = ${post.id}
               )
             `.as("comment_count"),
        isSaved: sql<UserToPost["saved"] | null>`
               (
                 SELECT saved
                 FROM users_to_posts
                 WHERE users_to_posts.post_id = ${post.id}
                   AND users_to_posts.user_id = ${c.var.currentUserId}
               )
             `.as("is_saved"),
        isHidden: sql<UserToPost["hidden"] | null>`
               (
                 SELECT hidden
                 FROM users_to_posts
                 WHERE users_to_posts.post_id = ${post.id}
                   AND users_to_posts.user_id = ${c.var.currentUserId}
               )
             `.as("is_hidden"),
        voteStatus: sql<UserToPost["voteStatus"] | null>`
               (
                 SELECT vote_status
                 FROM users_to_posts
                 WHERE users_to_posts.post_id = ${post.id}
                   AND users_to_posts.user_id = ${c.var.currentUserId}
               )
             `.as("vote_status"),
        userToPostUpdatedAt: sql<UserToPost["updatedAt"] | null>`
               (
                 SELECT updated_at
                 FROM users_to_posts
                 WHERE users_to_posts.post_id = ${post.id}
                   AND users_to_posts.user_id = ${c.var.currentUserId}
               )
             `.as("user_to_post_updated_at"),
      }),
    });

    return c.json(data, 200);
  })
  .post(
    "/",
    validator("json", (value, c) => {
      const parsed = PostSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
      })
        .and(
          z.object({
            files: z.optional(
              PostFileSchema.pick({
                key: true,
                url: true,
                name: true,
                thumbHash: true,
              }).array(),
            ),
          }),
        )
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
      const { files, ...post } = c.req.valid("json");

      let data;

      if (!files) {
        data = await c.var.db
          .insert(posts)
          .values({ ...post, authorId: c.var.currentUserId })
          .returning({ id: posts.id });
      } else {
        const postId = uuidv4();

        data = await c.var.db.batch([
          c.var.db
            .insert(posts)
            .values({
              ...post,
              text: null,
              id: postId,
              authorId: c.var.currentUserId,
            })
            .returning({ id: posts.id }),
          c.var.db
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
      const parsed = PostSchema.pick({ text: true }).safeParse(value);

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

      await c.var.db
        .update(posts)
        .set({ ...json })
        .where(
          and(eq(posts.id, postId), eq(posts.authorId, c.var.currentUserId)),
        );

      return c.status(204);
    },
  )
  .delete(`/:postId{${reg}}`, mwAuthenticated, async (c) => {
    const postId = c.req.param("postId");

    await c.var.db.delete(posts).where(
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
    );

    return c.status(204);
  });
