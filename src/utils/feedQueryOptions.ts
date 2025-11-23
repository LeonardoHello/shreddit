import { sql, type SQL } from "drizzle-orm";
import type { Context } from "hono";
import { validator } from "hono/validator";
import * as z from "zod/mini";

import { usersToCommunities } from "@/db/schema/communities";
import { PostSchema, usersToPosts, UserToPost } from "@/db/schema/posts";
import { Env } from "@/hono/init";
import { PostSort } from "@/types/enums";
import { getOneMonthAgo } from "./getOneMonthAgo";

const PostCursorSchema = z.discriminatedUnion("sort", [
  z.object({
    sort: z.literal(PostSort.BEST),
    cursor: z.optional(
      z.object({
        id: PostSchema.shape.id,
        voteCount: z.number(),
      }),
    ),
  }),
  z.object({
    sort: z.literal(PostSort.HOT),
    cursor: z.optional(
      z.object({
        id: PostSchema.shape.id,
        voteCount: z.number(),
      }),
    ),
  }),
  z.object({
    sort: z.literal(PostSort.NEW),
    cursor: z.optional(PostSchema.pick({ id: true, createdAt: true })),
  }),
  z.object({
    sort: z.literal(PostSort.CONTROVERSIAL),
    cursor: z.optional(
      z.object({
        id: PostSchema.shape.id,
        commentCount: z.number(),
      }),
    ),
  }),
  // z.object({
  //   sort: z.enum(PostSort),
  //   cursor: z.nullable(z.undefined()),
  // }),
]);

function decodeCursor(str: string) {
  try {
    const jsonString = Buffer.from(str, "base64").toString("utf8");
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Invalid cursor provided:", error);
    return null;
  }
}

function encodeCursor(cursor: object) {
  return Buffer.from(JSON.stringify(cursor)).toString("base64");
}

export const feedHonoValidation = validator("query", (value, c) => {
  const parsed = z
    .object({
      sort: z.enum(PostSort),
      cursor: z.nullish(z.string()),
    })
    .safeParse(value);

  if (!parsed.success) {
    const error = parsed.error._zod.def[0];
    return c.text(
      `400 Invalid query parameter for ${error.path}. ${error.message}`,
      400,
    );
  }

  const cursor = parsed.data.cursor;

  if (cursor === null || cursor === undefined) {
    return { sort: parsed.data.sort, cursor };
  }

  const decodedCursor = decodeCursor(cursor);

  if (decodedCursor === null) {
    return c.text("400 Invalid pagination cursor format", 400);
  }

  const transformed = PostCursorSchema.safeParse({
    sort: parsed.data.sort,
    cursor: decodedCursor,
  });

  if (!transformed.success) {
    return c.text("400 Invalid query parameter for cursor", 400);
  }

  return transformed.data;
});

export const feedHonoResponse = async (
  c: Context,
  variables: Env["Variables"],
  query:
    | z.infer<typeof PostCursorSchema>
    | { sort: PostSort; cursor: null | undefined },
  hideHidden: boolean,
  hideMuted: boolean,
  initialSQL?: SQL,
) => {
  const { db, currentUserId } = variables;

  const data = await db.query.posts.findMany({
    limit: 10,
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
    extras: (post) => ({
      voteCount: sql<number>`
          (
            SELECT (
              COALESCE(SUM(
                CASE 
                  WHEN vote_status = 'upvoted' THEN 1
                  WHEN vote_status = 'downvoted' THEN -1
                  ELSE 0
                END
              ), 0)
            )::int
            FROM users_to_posts
            WHERE users_to_posts.post_id = ${post.id}
          )
        `.as("vote_count"),
      commentCount: sql<number>`
          (
            SELECT COUNT(*)::int
            FROM comments
            WHERE comments.post_id = ${post.id}
          )
        `.as("comment_count"),
      isSaved: sql<UserToPost["saved"] | null>`
          CASE
            WHEN ${sql`${currentUserId}::text`} IS NULL THEN NULL
            ELSE (
              SELECT saved
              FROM users_to_posts
              WHERE users_to_posts.post_id = ${post.id}
                AND users_to_posts.user_id = ${currentUserId}
            )
          END
        `.as("is_saved"),
      isHidden: sql<UserToPost["hidden"] | null>`
          CASE
            WHEN ${sql`${currentUserId}::text`} IS NULL THEN NULL
            ELSE (
              SELECT hidden
              FROM users_to_posts
              WHERE users_to_posts.post_id = ${post.id}
                AND users_to_posts.user_id = ${currentUserId}
            )
          END
        `.as("is_hidden"),
      voteStatus: sql<UserToPost["voteStatus"] | null>`
          CASE
            WHEN ${sql`${currentUserId}::text`} IS NULL THEN NULL
            ELSE (
              SELECT vote_status
              FROM users_to_posts
              WHERE users_to_posts.post_id = ${post.id}
                AND users_to_posts.user_id = ${currentUserId}
            )
          END
        `.as("vote_status"),
      userToPostUpdatedAt: sql<UserToPost["updatedAt"] | null>`
          CASE
            WHEN ${sql`${currentUserId}::text`} IS NULL THEN NULL
            ELSE (
              SELECT updated_at
              FROM users_to_posts
              WHERE users_to_posts.post_id = ${post.id}
                AND users_to_posts.user_id = ${currentUserId}
            )
          END
        `.as("user_to_post_updated_at"),
    }),
    where: (post, { and, or, eq, gt, lt, notExists, sql }) => {
      const filters: (SQL | undefined)[] = [initialSQL];

      if (currentUserId) {
        if (hideHidden) {
          filters.push(
            notExists(
              db
                .select()
                .from(usersToPosts)
                .where(
                  and(
                    eq(usersToPosts.postId, post.id),
                    eq(usersToPosts.userId, currentUserId),
                    eq(usersToPosts.hidden, true),
                  ),
                ),
            ),
          );
        }
        if (hideMuted) {
          filters.push(
            notExists(
              db
                .select()
                .from(usersToCommunities)
                .where(
                  and(
                    eq(usersToCommunities.communityId, post.communityId),
                    eq(usersToCommunities.userId, currentUserId),
                    eq(usersToCommunities.muted, true),
                  ),
                ),
            ),
          );
        }
      }

      if (query.sort === PostSort.HOT) {
        filters.push(gt(post.createdAt, getOneMonthAgo()));
      }

      if (query.cursor) {
        switch (query.sort) {
          case PostSort.NEW:
            filters.push(
              or(
                lt(post.createdAt, query.cursor.createdAt),
                and(
                  eq(post.createdAt, query.cursor.createdAt),
                  lt(post.id, query.cursor.id),
                ),
              ),
            );
            break;

          case PostSort.CONTROVERSIAL:
            const commentCountSql = sql<number>`
                  (
                    SELECT COUNT(*)::int
                    FROM comments
                    WHERE comments.post_id = ${post.id}
                  )
                `;

            filters.push(
              or(
                lt(commentCountSql, query.cursor.commentCount),
                and(
                  eq(commentCountSql, query.cursor.commentCount),
                  lt(post.id, query.cursor.id),
                ),
              ),
            );
            break;

          default:
            const voteCountSql = sql<number>`
                  (
                    SELECT (
                        COALESCE(SUM(
                            CASE 
                                WHEN vote_status = 'upvoted' THEN 1
                                WHEN vote_status = 'downvoted' THEN -1
                                ELSE 0
                            END
                        ), 0)
                    )::int
                    FROM users_to_posts
                    WHERE users_to_posts.post_id = ${post.id}
                  )
                `;

            filters.push(
              or(
                lt(voteCountSql, query.cursor.voteCount),
                and(
                  eq(voteCountSql, query.cursor.voteCount),
                  lt(post.id, query.cursor.id),
                ),
              ),
            );
            break;
        }
      }

      return and(...filters);
    },
    orderBy: (post, { desc }) => {
      return {
        [PostSort.BEST]: [desc(sql`vote_count`), desc(post.id)],
        [PostSort.HOT]: [desc(sql`vote_count`), desc(post.id)],
        [PostSort.NEW]: [desc(post.createdAt), desc(post.id)],
        [PostSort.CONTROVERSIAL]: [desc(sql`comment_count`), desc(post.id)],
      }[query.sort];
    },
  });

  let nextCursor = null;

  if (data.length !== 10) {
    return c.json({ posts: data, nextCursor }, 200);
  }

  const { id, createdAt, commentCount, voteCount } = data[data.length - 1];

  switch (query.sort) {
    case PostSort.NEW:
      nextCursor = encodeCursor({ id, createdAt });
      break;

    case PostSort.CONTROVERSIAL:
      nextCursor = encodeCursor({ id, commentCount });
      break;

    default:
      nextCursor = encodeCursor({ id, voteCount });
      break;
  }

  return c.json({ posts: data, nextCursor }, 200);
};
