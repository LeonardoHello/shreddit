import { sql } from "drizzle-orm";

import db from "@/db";
import { usersToCommunities } from "@/db/schema/communities";
import { usersToPosts, UserToPost } from "@/db/schema/posts";
import { PostSort } from "@/types";
import { monthAgo } from "./getLastMonthDate";

export type PostsQueryConfig = NonNullable<
  Parameters<(typeof db)["query"]["posts"]["findMany"]>[0]
>;

const postsQueryConfig = (props: {
  sort: PostSort;
  hideHidden: boolean;
  hideCommunityMuted: boolean;
}) =>
  ({
    limit: 10,
    offset: sql.placeholder("offset"),
    with: {
      community: { columns: { name: true, icon: true } },
      author: { columns: { username: true, imageUrl: true } },
      files: { columns: { id: true, name: true, url: true, thumbHash: true } },
    },
    where: (post, { eq, and, gt, notExists }) =>
      and(
        props.hideHidden
          ? notExists(
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
            )
          : undefined,
        props.hideCommunityMuted
          ? notExists(
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
            )
          : undefined,
        props.sort === PostSort.HOT ? gt(post.createdAt, monthAgo) : undefined,
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
      switch (props.sort) {
        case PostSort.NEW:
          return [desc(post.createdAt)];

        case PostSort.CONTROVERSIAL:
          return [desc(sql`comment_count`), asc(post.createdAt)];

        default:
          return [desc(sql`vote_count`), asc(post.createdAt)];
      }
    },
  }) satisfies PostsQueryConfig;

export const bestPostsQueryConfig = (props: {
  hideHidden: boolean;
  hideCommunityMuted: boolean;
}) => postsQueryConfig({ sort: PostSort.BEST, ...props });

export const hotPostsQueryConfig = (props: {
  hideHidden: boolean;
  hideCommunityMuted: boolean;
}) => postsQueryConfig({ sort: PostSort.HOT, ...props });

export const newPostsQueryConfig = (props: {
  hideHidden: boolean;
  hideCommunityMuted: boolean;
}) => postsQueryConfig({ sort: PostSort.NEW, ...props });

export const controversialPostsQueryConfig = (props: {
  hideHidden: boolean;
  hideCommunityMuted: boolean;
}) => postsQueryConfig({ sort: PostSort.CONTROVERSIAL, ...props });
