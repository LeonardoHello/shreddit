import { and, eq, sql } from "drizzle-orm";

import db from "../db";
import {
  type Post,
  type UserToPost,
  usersToCommunities,
  usersToPosts,
} from "../db/schema";
import { posts } from "../db/schema";

export const getJoinedCommunitiesPosts = (userId: UserToPost["userId"]) => {
  return db.query.posts
    .findMany({
      limit: 10,
      where: (post, { exists }) =>
        exists(
          db
            .select()
            .from(usersToCommunities)
            .where(
              and(
                eq(usersToCommunities.userId, userId),
                eq(usersToCommunities.member, true),
                eq(usersToCommunities.userId, post.authorId),
              ),
            ),
        ),
      offset: sql.placeholder("offset"),
      with: {
        usersToPosts: true,
        community: { columns: { name: true, imageUrl: true } },
        author: { columns: { name: true } },
        comments: { columns: { id: true } },
        files: true,
      },
      orderBy: (post, { desc }) => [desc(post.createdAt)],
    })
    .prepare("getJoinedCommunitiesPosts");
};

export const updatePostSpoilerTag = ({
  authorId,
  id,
  spoiler,
}: {
  authorId: Post["authorId"];
  id: Post["id"];
  spoiler: Post["spoiler"];
}) => {
  return db
    .update(posts)
    .set({ spoiler })
    .where(and(eq(posts.authorId, authorId), eq(posts.id, id)))
    .returning({ id: posts.id, updatedSpoilerTag: posts.spoiler });
};

export const updatePostNSFWTag = ({
  authorId,
  id,
  nsfw,
}: {
  authorId: Post["authorId"];
  id: Post["id"];
  nsfw: Post["nsfw"];
}) => {
  return db
    .update(posts)
    .set({ nsfw })
    .where(and(eq(posts.authorId, authorId), eq(posts.id, id)))
    .returning({ id: posts.id, updatedNSFWTag: posts.nsfw });
};

export const deletePost = (postId: string) => {
  return db
    .delete(posts)
    .where(eq(posts.id, postId))
    .returning({ id: posts.id });
};
