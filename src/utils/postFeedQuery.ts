import { SQL, sql } from "drizzle-orm";
import * as z from "zod/mini";

import db from "@/db";
import { communities, usersToCommunities } from "@/db/schema/communities";
import { PostSchema, usersToPosts, UserToPost } from "@/db/schema/posts";
import { users } from "@/db/schema/users";
import type { UserId } from "@/lib/auth";
import { PostSort } from "@/types/enums";
import { getOneMonthAgo } from "./getOneMonthAgo";

type InputConfig = NonNullable<
  Parameters<(typeof db)["query"]["posts"]["findMany"]>[0]
>;

export const PostCursorSchema = z.discriminatedUnion("sort", [
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
]);

export const postFeedQuery =
  (
    postFeed:
      | "all"
      | "home"
      | "user"
      | "community"
      | "upvoted"
      | "downvoted"
      | "saved"
      | "hidden",
  ) =>
  (postSort: PostSort) =>
    db.query.posts
      .findMany({
        limit: 10,
        offset: sql.placeholder("offset"),
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
        where: (post, { and, gt, exists, notExists, eq }) => {
          const filters: SQL[] = [];

          const hideHiddenPosts = notExists(
            db
              .select()
              .from(usersToPosts)
              .where(
                and(
                  eq(usersToPosts.postId, post.id),
                  eq(usersToPosts.userId, sql.placeholder("currentUserId")),
                  eq(usersToPosts.hidden, true),
                ),
              ),
          );
          const hideMutedPosts = notExists(
            db
              .select()
              .from(usersToCommunities)
              .where(
                and(
                  eq(usersToCommunities.communityId, post.communityId),
                  eq(
                    usersToCommunities.userId,
                    sql.placeholder("currentUserId"),
                  ),
                  eq(usersToCommunities.muted, true),
                ),
              ),
          );

          switch (postFeed) {
            case "home":
              filters.push(
                hideHiddenPosts,
                hideMutedPosts,
                exists(
                  db
                    .select()
                    .from(usersToCommunities)
                    .where(
                      and(
                        eq(
                          usersToCommunities.userId,
                          sql.placeholder("currentUserId"),
                        ),
                        eq(usersToCommunities.communityId, post.communityId),
                        eq(usersToCommunities.joined, true),
                      ),
                    ),
                ),
              );
              break;

            case "user":
              filters.push(
                exists(
                  db
                    .select()
                    .from(users)
                    .where(
                      and(
                        eq(users.id, post.authorId),
                        eq(users.username, sql.placeholder("username")),
                      ),
                    ),
                ),
              );
              break;

            case "community":
              filters.push(
                hideHiddenPosts,
                exists(
                  db
                    .select({ id: communities.id })
                    .from(communities)
                    .where(
                      and(
                        eq(communities.id, post.communityId),
                        eq(communities.name, sql.placeholder("communityName")),
                      ),
                    ),
                ),
              );
              break;

            case "upvoted":
              filters.push(
                exists(
                  db
                    .select()
                    .from(usersToPosts)
                    .innerJoin(
                      users,
                      and(
                        eq(users.id, usersToPosts.userId),
                        eq(users.username, sql.placeholder("username")),
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

            case "downvoted":
              filters.push(
                exists(
                  db
                    .select()
                    .from(usersToPosts)
                    .innerJoin(
                      users,
                      and(
                        eq(users.id, usersToPosts.userId),
                        eq(users.username, sql.placeholder("username")),
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

            case "saved":
              filters.push(
                exists(
                  db
                    .select()
                    .from(usersToPosts)
                    .innerJoin(
                      users,
                      and(
                        eq(users.id, usersToPosts.userId),
                        eq(users.username, sql.placeholder("username")),
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

            case "hidden":
              filters.push(
                exists(
                  db
                    .select()
                    .from(usersToPosts)
                    .innerJoin(
                      users,
                      and(
                        eq(users.id, usersToPosts.userId),
                        eq(users.username, sql.placeholder("username")),
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
              filters.push(hideHiddenPosts, hideMutedPosts);
              break;
          }

          if (postSort === PostSort.HOT)
            filters.push(gt(post.createdAt, getOneMonthAgo()));

          return and(...filters);
        },
        extras: (post) => ({
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
            AND users_to_posts.user_id = ${sql.placeholder("currentUserId")}
        )
      `.as("is_saved"),
          isHidden: sql<UserToPost["hidden"] | null>`
        (
          SELECT hidden
          FROM users_to_posts
          WHERE users_to_posts.post_id = ${post.id}
            AND users_to_posts.user_id = ${sql.placeholder("currentUserId")}
        )
      `.as("is_hidden"),
          voteStatus: sql<UserToPost["voteStatus"] | null>`
        (
          SELECT vote_status
          FROM users_to_posts
          WHERE users_to_posts.post_id = ${post.id}
            AND users_to_posts.user_id = ${sql.placeholder("currentUserId")}
        )
        `.as("vote_status"),
          userToPostUpdatedAt: sql<UserToPost["updatedAt"] | null>`
        (
          SELECT updated_at
          FROM users_to_posts
          WHERE users_to_posts.post_id = ${post.id}
            AND users_to_posts.user_id = ${sql.placeholder("currentUserId")}
        )
      `.as("user_to_post_updated_at"),
        }),
        orderBy: (post, { desc, asc }) => {
          const orderBy = {
            [PostSort.BEST]: [desc(sql`vote_count`), asc(post.createdAt)],
            [PostSort.HOT]: [desc(sql`vote_count`), asc(post.createdAt)],
            [PostSort.NEW]: [desc(post.createdAt)],
            [PostSort.CONTROVERSIAL]: [
              desc(sql`comment_count`),
              asc(post.createdAt),
            ],
          }[postSort];

          return orderBy;
        },
      })
      .prepare("post_feed");

export const postFeedQueryx = ({
  currentUserId,
  postSort,
}: {
  currentUserId: UserId;
  postSort: PostSort;
}) =>
  ({
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
    orderBy: (post, { desc }) => {
      return {
        [PostSort.BEST]: [desc(sql`vote_count`), desc(post.id)],
        [PostSort.HOT]: [desc(sql`vote_count`), desc(post.id)],
        [PostSort.NEW]: [desc(post.createdAt), desc(post.id)],
        [PostSort.CONTROVERSIAL]: [desc(sql`comment_count`), desc(post.id)],
      }[postSort];
    },
  }) satisfies InputConfig;
