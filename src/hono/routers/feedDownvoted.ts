import { SQL } from "drizzle-orm";
import { validator } from "hono/validator";

import { usersToPosts } from "@/db/schema/posts";
import { users } from "@/db/schema/users";
import { PostSort } from "@/types/enums";
import { getOneMonthAgo } from "@/utils/getOneMonthAgo";
import { encodeCursor } from "@/utils/hono";
import { PostCursorSchema, postFeedQueryx } from "@/utils/postFeedQuery";
import { factory } from "../init";

export const feedDownvoted = factory.createApp().get(
  "/:username/downvoted",
  validator("query", (value, c) => {
    const parsed = PostCursorSchema.safeParse(value);

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
    const username = c.req.param("username");
    const query = c.req.valid("query");

    const queryConfig = postFeedQueryx({
      currentUserId: c.var.currentUserId,
      postSort: query.sort,
    });

    const data = await c.var.db.query.posts.findMany({
      ...queryConfig,
      where: (post, { and, gt, or, eq, sql, exists, lt }) => {
        const filters: (SQL | undefined)[] = [
          exists(
            c.var.db
              .select()
              .from(usersToPosts)
              .innerJoin(
                users,
                and(
                  eq(users.id, usersToPosts.userId),
                  eq(users.username, username),
                ),
              )
              .where(
                and(
                  eq(usersToPosts.postId, post.id),
                  eq(usersToPosts.voteStatus, "downvoted"),
                ),
              ),
          ),
        ];

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
