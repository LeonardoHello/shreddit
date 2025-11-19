import { SQL } from "drizzle-orm";
import { validator } from "hono/validator";

import { usersToPosts } from "@/db/schema/posts";
import { users } from "@/db/schema/users";
import { PostSort } from "@/types/enums";
import { getOneMonthAgo } from "@/utils/getOneMonthAgo";
import { PostCursorSchema, postFeedQueryx } from "@/utils/postFeedQuery";
import { factory } from "../init";

export const feedHidden = factory.createApp().get(
  "/:username/hidden",
  validator("query", (value, c) => {
    const parsed = PostCursorSchema.safeParse(value);

    if (!parsed.success) {
      return c.text(
        `400 Invalid query parameter for ${parsed.error.name}`,
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
      where: (post, { and, gt, or, eq, sql, exists }) => {
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
                  eq(usersToPosts.hidden, true),
                ),
              ),
          ),
        ];

        if (query.sort === PostSort.HOT) {
          filters.push(gt(post.createdAt, getOneMonthAgo()));
        }

        if (query.cursor) {
          switch (query.sort) {
            case PostSort.HOT:
              filters.push(
                or(
                  gt(sql`vote_count`, query.cursor.voteCount),
                  and(
                    eq(sql`vote_count`, query.cursor.voteCount),
                    gt(post.id, query.cursor.id),
                  ),
                ),
              );
              break;

            case PostSort.NEW:
              filters.push(
                or(
                  gt(post.createdAt, query.cursor.createdAt),
                  and(
                    eq(post.createdAt, query.cursor.createdAt),
                    gt(post.id, query.cursor.id),
                  ),
                ),
              );
              break;

            case PostSort.CONTROVERSIAL:
              filters.push(
                or(
                  gt(sql`comment_count`, query.cursor.commentCount),
                  and(
                    eq(sql`comment_count`, query.cursor.commentCount),
                    gt(post.id, query.cursor.id),
                  ),
                ),
              );
              break;

            default:
              filters.push(
                or(
                  gt(sql`vote_count`, query.cursor.voteCount),
                  and(
                    eq(sql`vote_count`, query.cursor.voteCount),
                    gt(post.id, query.cursor.id),
                  ),
                ),
              );
              break;
          }
        }

        return and(...filters);
      },
    });

    return c.json(data, 200);
  },
);
