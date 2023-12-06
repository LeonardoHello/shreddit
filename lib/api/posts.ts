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
    .returning({ spoiler: posts.spoiler });
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
    .returning({ nsfw: posts.nsfw });
};

export const deletePost = (postId: string) => {
  return db.delete(posts).where(eq(posts.id, postId));
};

export const upvotePost = ({
  userId,
  postId,
  upvoted,
}: {
  userId: UserToPost["userId"];
  postId: UserToPost["postId"];
  upvoted: UserToPost["upvoted"];
}) => {
  return db
    .insert(usersToPosts)
    .values({ postId, userId, upvoted })
    .onConflictDoUpdate({
      target: [usersToPosts.userId, usersToPosts.postId],
      set: { upvoted, downvoted: false },
    })
    .returning();
};

export const downvotePost = ({
  userId,
  postId,
  downvoted,
}: {
  userId: UserToPost["userId"];
  postId: UserToPost["postId"];
  downvoted: UserToPost["downvoted"];
}) => {
  return db
    .insert(usersToPosts)
    .values({ postId, userId, downvoted })
    .onConflictDoUpdate({
      target: [usersToPosts.userId, usersToPosts.postId],
      set: { downvoted, upvoted: false },
    })
    .returning();
};
