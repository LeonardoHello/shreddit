import { SQL, sql } from "drizzle-orm";

import db from "@/db";
import { usersToCommunities } from "@/db/schema/communities";
import { usersToPosts, UserToPost } from "@/db/schema/posts";
import { PostSort } from "@/types/enums";
import { monthAgo } from "./getLastMonthDate";

export type PostsQueryConfig = NonNullable<
  Parameters<(typeof db)["query"]["posts"]["findMany"]>[0]
>;

export const postsQueryConfig = ({
  postSort,
  hideHiddenPosts = false,
  hideMutedCommunityPosts = false,
}: {
  postSort: PostSort;
  hideHiddenPosts?: boolean;
  hideMutedCommunityPosts?: boolean;
}) =>
  ({
    limit: 10,
    offset: sql.placeholder("offset"),
    with: {
      community: { columns: { name: true, icon: true } },
      author: { columns: { username: true, imageUrl: true } },
      files: { columns: { id: true, name: true, url: true, thumbHash: true } },
    },
    where: (post, { and, gt, notExists, eq }) => {
      const filters: SQL[] = [];

      if (postSort === PostSort.HOT) filters.push(gt(post.createdAt, monthAgo));
      if (hideHiddenPosts)
        filters.push(
          notExists(
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
          ),
        );
      if (hideMutedCommunityPosts)
        filters.push(
          notExists(
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
          ),
        );

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
  }) satisfies PostsQueryConfig;
