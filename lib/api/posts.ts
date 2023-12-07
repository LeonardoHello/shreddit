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
}: Pick<Post, "authorId" | "id" | "spoiler">) => {
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
}: Pick<Post, "authorId" | "id" | "nsfw">) => {
  return db
    .update(posts)
    .set({ nsfw })
    .where(and(eq(posts.authorId, authorId), eq(posts.id, id)))
    .returning({ nsfw: posts.nsfw });
};

export const deletePost = (postId: string) => {
  return db.delete(posts).where(eq(posts.id, postId));
};

export const upvotePost = (
  input: Pick<UserToPost, "userId" | "postId" | "upvoted">,
) => {
  return db
    .insert(usersToPosts)
    .values(input)
    .onConflictDoUpdate({
      target: [usersToPosts.userId, usersToPosts.postId],
      set: { upvoted: input.upvoted, downvoted: false },
    })
    .returning();
};

export const downvotePost = (
  input: Pick<UserToPost, "userId" | "postId" | "downvoted">,
) => {
  return db
    .insert(usersToPosts)
    .values(input)
    .onConflictDoUpdate({
      target: [usersToPosts.userId, usersToPosts.postId],
      set: { upvoted: false, downvoted: input.downvoted },
    })
    .returning();
};
