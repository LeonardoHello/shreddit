import { SQL } from "drizzle-orm";
import { validator } from "hono/validator";

import { usersToCommunities } from "@/db/schema/communities";
import { usersToPosts } from "@/db/schema/posts";
import { PostSort } from "@/types/enums";
import { monthAgo } from "@/utils/getLastMonthDate";
import { PostCursorSchema, postFeedQueryx } from "@/utils/postFeedQuery";
import { factory } from "../init";

export const feedAll = factory.createApp().get(
  "/all",
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
    const query = c.req.valid("query");

    const queryConfig = postFeedQueryx({
      currentUserId: c.var.currentUserId,
      postSort: query.sort,
    });

    const data = await c.var.db.query.posts.findMany({
      ...queryConfig,
      where: (post, { and, gt, or, eq, sql, notExists }) => {
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
          filters.push(gt(post.createdAt, monthAgo));
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
