import { SQL } from "drizzle-orm";
import { validator } from "hono/validator";
import * as z from "zod/mini";

import { usersToCommunities } from "@/db/schema/communities";
import { usersToPosts } from "@/db/schema/posts";
import { PostSort } from "@/types/enums";
import { getOneMonthAgo } from "@/utils/getOneMonthAgo";
import { decodeCursor, encodeCursor } from "@/utils/hono";
import { PostCursorSchema, postFeedQueryx } from "@/utils/postFeedQuery";
import { factory } from "../init";

export const feedAll = factory.createApp().get(
  "/all",
  validator("query", (value, c) => {
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
  }),
  async (c) => {
    const query = c.req.valid("query");

    const queryConfig = postFeedQueryx({
      currentUserId: c.var.currentUserId,
      postSort: query.sort,
    });

    const data = await c.var.db.query.posts.findMany({
      where: (post, { and, gt, lt, or, eq, sql, notExists }) => {
        const filters: (SQL | undefined)[] = [];

        if (c.var.currentUserId) {
          filters.push(
            notExists(
              c.var.db
                .select()
                .from(usersToPosts)
                .where(
                  and(
                    eq(usersToPosts.postId, post.id),
                    eq(usersToPosts.userId, c.var.currentUserId),
                    eq(usersToPosts.hidden, true),
                  ),
                ),
            ),
            notExists(
              c.var.db
                .select()
                .from(usersToCommunities)
                .where(
                  and(
                    eq(usersToCommunities.communityId, post.communityId),
                    eq(usersToCommunities.userId, c.var.currentUserId),
                    eq(usersToCommunities.muted, true),
                  ),
                ),
            ),
          );
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
      ...queryConfig,
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
  },
);
