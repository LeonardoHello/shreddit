import { DBQueryConfig, ExtractTablesWithRelations, sql } from "drizzle-orm";

import db from "@/db";
import { PostSort } from "@/types";
import * as schema from "../db/schema";
import { monthAgo } from "./getLastMonthDate";

export type PostsQueryConfig = DBQueryConfig<
  "many",
  true,
  ExtractTablesWithRelations<typeof schema>,
  ExtractTablesWithRelations<typeof schema>["posts"]
>;

export const postsQueryConfig = ({
  sort,
  showHidden,
  hideMuted,
}: {
  sort?: PostSort;
  showHidden?: boolean;
  hideMuted?: boolean;
}) =>
  ({
    limit: 10,
    offset: sql.placeholder("offset"),
    with: {
      community: {
        columns: { name: true, imageUrl: true },
        with: {
          usersToCommunities: { columns: { muted: true, userId: true } },
        },
      },
      author: { columns: { username: true } },
      files: true,
    },
    where: (post, { eq, and, notExists, gt }) =>
      and(
        !showHidden
          ? notExists(
              db
                .select()
                .from(schema.usersToPosts)
                .where(
                  and(
                    eq(schema.usersToPosts.postId, post.id),
                    eq(
                      schema.usersToPosts.userId,
                      sql.placeholder("currentUserId"),
                    ),
                    eq(schema.usersToPosts.hidden, true),
                  ),
                ),
            )
          : undefined,
        hideMuted
          ? notExists(
              db
                .select()
                .from(schema.usersToCommunities)
                .where(
                  and(
                    eq(schema.usersToCommunities.communityId, post.communityId),
                    eq(
                      schema.usersToCommunities.userId,
                      sql.placeholder("currentUserId"),
                    ),
                    eq(schema.usersToCommunities.muted, true),
                  ),
                ),
            )
          : undefined,
        sort === PostSort.HOT ? gt(post.createdAt, monthAgo) : undefined,
      ),
    extras: (post) => ({
      voteCount: sql<number>`
        (
          SELECT COUNT(*)
          FROM users_to_posts
          WHERE users_to_posts.post_id = ${post.id}
            AND users_to_posts.vote_status = 'upvoted'
        ) - (
          SELECT COUNT(*)
          FROM users_to_posts
          WHERE users_to_posts.post_id = ${post.id}
            AND users_to_posts.vote_status = 'downvoted'
        )
      `.as("vote_count"),
      commentCount: sql<number>`
        (
          SELECT COUNT(*)
          FROM comments
          WHERE comments.post_id = ${post.id}
        )
      `.as("comment_count"),
      isSaved: sql<schema.UserToPost["saved"] | null>`
        (
          SELECT saved
          FROM users_to_posts
          WHERE users_to_posts.post_id = ${post.id}
            AND users_to_posts.user_id = ${sql.placeholder("currentUserId")}
        )
      `.as("is_saved"),
      isHidden: sql<schema.UserToPost["hidden"] | null>`
        (
          SELECT hidden
          FROM users_to_posts
          WHERE users_to_posts.post_id = ${post.id}
            AND users_to_posts.user_id = ${sql.placeholder("currentUserId")}
        )
      `.as("is_hidden"),
      voteStatus: sql<schema.UserToPost["voteStatus"] | null>`
        (
          SELECT vote_status
          FROM users_to_posts
          WHERE users_to_posts.post_id = ${post.id}
            AND users_to_posts.user_id = ${sql.placeholder("currentUserId")}
        )
      `.as("vote_status"),
    }),
    orderBy: (post, { desc, asc }) => {
      switch (sort) {
        case PostSort.HOT:
          return [desc(sql`vote_count`), asc(post.createdAt)];

        case PostSort.NEW:
          return [desc(post.createdAt)];

        case PostSort.CONTROVERSIAL:
          return [desc(sql`comment_count`), asc(post.createdAt)];

        default:
          return [desc(sql`vote_count`), asc(post.createdAt)];
      }
    },
  }) satisfies PostsQueryConfig;

export const bestPosts = postsQueryConfig({});
export const hotPosts = postsQueryConfig({ sort: PostSort.HOT });
export const newPosts = postsQueryConfig({ sort: PostSort.NEW });
export const controversialPosts = postsQueryConfig({
  sort: PostSort.CONTROVERSIAL,
});
