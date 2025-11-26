import type { SQL } from "drizzle-orm";
import type { Context } from "hono";
import { validator } from "hono/validator";
import * as v from "valibot";

import type drizzleDb from "@/db";
import {
  communities,
  usersToCommunities,
  type Community,
} from "@/db/schema/communities";
import { PostSchema, usersToPosts, UserToPost } from "@/db/schema/posts";
import { users, type User } from "@/db/schema/users";
import type { Env } from "@/hono/init";
import type { UserId } from "@/lib/auth";
import { PostFeed, PostSort } from "@/types/enums";
import { getOneMonthAgo } from "./getOneMonthAgo";

const PostCursorSchema = v.variant("sort", [
  v.object({
    sort: v.literal(PostSort.BEST),
    cursor: v.optional(
      v.object({
        id: PostSchema.entries.id,
        voteCount: v.number(),
      }),
    ),
  }),
  v.object({
    sort: v.literal(PostSort.HOT),
    cursor: v.optional(
      v.object({
        id: PostSchema.entries.id,
        voteCount: v.number(),
      }),
    ),
  }),
  v.object({
    sort: v.literal(PostSort.NEW),
    cursor: v.optional(v.pick(PostSchema, ["id", "createdAt"])),
  }),
  v.object({
    sort: v.literal(PostSort.CONTROVERSIAL),
    cursor: v.optional(
      v.object({
        id: PostSchema.entries.id,
        commentCount: v.number(),
      }),
    ),
  }),
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
  const parsed = v.safeParse(
    v.object({
      sort: v.enum(PostSort),
      cursor: v.nullish(v.string()),
    }),
    value,
  );

  if (!parsed.success) {
    const error = parsed.issues[0];
    return c.text(`400 ${error.message}`, 400);
  }

  const cursor = parsed.output.cursor;

  if (cursor === null || cursor === undefined) {
    return { ...parsed.output, cursor };
  }

  const decodedCursor = decodeCursor(cursor);

  if (decodedCursor === null) {
    return c.text("400 Invalid pagination cursor format", 400);
  }

  const transformed = v.safeParse(PostCursorSchema, {
    sort: parsed.output.sort,
    cursor: decodedCursor,
  });

  if (!transformed.success) {
    const error = transformed.issues[0];
    return c.text(`400 ${error.message}`, 400);
  }

  return transformed.output;
});

type InputConfig = NonNullable<
  Parameters<(typeof drizzleDb)["query"]["posts"]["findMany"]>[0]
>;

export const postInputConfig = (currentUserId: UserId) =>
  ({
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
            SELECT (
              COALESCE(SUM(
                CASE 
                  WHEN vote_status = 'upvoted' THEN 1
                  WHEN vote_status = 'downvoted' THEN -1
                  ELSE 0
                END
              ), 0)::int
            )
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
      isSaved: currentUserId
        ? sql<UserToPost["saved"]>`
          (
            SELECT saved
            FROM users_to_posts
            WHERE users_to_posts.post_id = ${post.id}
              AND users_to_posts.user_id = ${currentUserId}
          )
        `.as("is_saved")
        : sql<null>`NULL`.as("is_saved"),
      isHidden: currentUserId
        ? sql<UserToPost["hidden"]>`
          (
            SELECT hidden
            FROM users_to_posts
            WHERE users_to_posts.post_id = ${post.id}
              AND users_to_posts.user_id = ${currentUserId}
          )
        `.as("is_hidden")
        : sql<null>`NULL`.as("is_hidden"),
      voteStatus: currentUserId
        ? sql<UserToPost["voteStatus"]>`
          (
            SELECT vote_status
            FROM users_to_posts
            WHERE users_to_posts.post_id = ${post.id}
              AND users_to_posts.user_id = ${currentUserId}
          )
        `.as("vote_status")
        : sql<null>`NULL`.as("vote_status"),
      userToPostUpdatedAt: currentUserId
        ? sql<UserToPost["updatedAt"]>`
          (
            SELECT updated_at
            FROM users_to_posts
            WHERE users_to_posts.post_id = ${post.id}
              AND users_to_posts.user_id = ${currentUserId}
          )
        `.as("user_to_post_updated_at")
        : sql<null>`NULL`.as("user_to_post_updated_at"),
    }),
  }) satisfies InputConfig;

type FeedProps = {
  [P in PostFeed]: P extends PostFeed.ALL
    ? {
        feed: P;
      }
    : P extends PostFeed.HOME
      ? {
          feed: P;
        }
      : P extends PostFeed.COMMUNITY
        ? {
            feed: P;
            communityName: Community["name"];
          }
        : {
            feed: P;
            username: NonNullable<User["username"]>;
          };
}[PostFeed];

type QueryProps =
  | v.InferInput<typeof PostCursorSchema>
  | { sort: PostSort; cursor: null | undefined };

export const feedHonoResponse = async (
  c: Context<Env>,
  query: QueryProps,
  feedProps: FeedProps,
) => {
  const currentUserId = c.get("currentUserId");
  const db = c.get("db");

  const inputConfig = postInputConfig(currentUserId);

  const data = await db.query.posts.findMany({
    ...inputConfig,
    limit: 10,
    where: (post, { and, or, eq, gt, lt, exists, notExists, sql }) => {
      const filters: (SQL | undefined)[] = [];

      const hideHidden = currentUserId
        ? notExists(
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
          )
        : undefined;

      const hideMuted = currentUserId
        ? notExists(
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
          )
        : undefined;

      switch (feedProps.feed) {
        case PostFeed.HOME:
          if (currentUserId) {
            filters.push(
              hideHidden,
              hideMuted,
              exists(
                db
                  .select()
                  .from(usersToCommunities)
                  .where(
                    and(
                      eq(usersToCommunities.userId, currentUserId),
                      eq(usersToCommunities.communityId, post.communityId),
                      eq(usersToCommunities.joined, true),
                    ),
                  ),
              ),
            );
          }
          break;

        case PostFeed.COMMUNITY:
          filters.push(
            hideHidden,
            exists(
              db
                .select({ id: communities.id })
                .from(communities)
                .where(
                  and(
                    eq(communities.id, post.communityId),
                    eq(communities.name, feedProps.communityName),
                  ),
                ),
            ),
          );
          break;

        case PostFeed.USER:
          filters.push(
            exists(
              db
                .select()
                .from(users)
                .where(
                  and(
                    eq(users.id, post.authorId),
                    eq(users.username, feedProps.username),
                  ),
                ),
            ),
          );
          break;

        case PostFeed.UPVOTED:
          filters.push(
            exists(
              db
                .select()
                .from(usersToPosts)
                .innerJoin(
                  users,
                  and(
                    eq(users.id, usersToPosts.userId),
                    eq(users.username, feedProps.username),
                  ),
                )
                .where(
                  and(
                    eq(usersToPosts.postId, post.id),
                    eq(usersToPosts.voteStatus, "upvoted"),
                  ),
                ),
            ),
          );
          break;

        case PostFeed.DOWNVOTED:
          filters.push(
            exists(
              db
                .select()
                .from(usersToPosts)
                .innerJoin(
                  users,
                  and(
                    eq(users.id, usersToPosts.userId),
                    eq(users.username, feedProps.username),
                  ),
                )
                .where(
                  and(
                    eq(usersToPosts.postId, post.id),
                    eq(usersToPosts.voteStatus, "downvoted"),
                  ),
                ),
            ),
          );
          break;

        case PostFeed.SAVED:
          filters.push(
            exists(
              db
                .select()
                .from(usersToPosts)
                .innerJoin(
                  users,
                  and(
                    eq(users.id, usersToPosts.userId),
                    eq(users.username, feedProps.username),
                  ),
                )
                .where(
                  and(
                    eq(usersToPosts.postId, post.id),
                    eq(usersToPosts.saved, true),
                  ),
                ),
            ),
          );
          break;

        case PostFeed.HIDDEN:
          filters.push(
            exists(
              db
                .select()
                .from(usersToPosts)
                .innerJoin(
                  users,
                  and(
                    eq(users.id, usersToPosts.userId),
                    eq(users.username, feedProps.username),
                  ),
                )
                .where(
                  and(
                    eq(usersToPosts.postId, post.id),
                    eq(usersToPosts.hidden, true),
                  ),
                ),
            ),
          );
          break;

        default:
          filters.push(hideHidden, hideMuted);
          break;
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
    orderBy: (post, { desc, sql }) => {
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
