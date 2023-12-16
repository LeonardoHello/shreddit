import { and, eq } from "drizzle-orm";

import db from "../db";
import { type Post, type UserToPost, usersToPosts } from "../db/schema";
import { posts } from "../db/schema";

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
  input: Pick<UserToPost, "userId" | "postId" | "voteStatus">,
) => {
  return db
    .insert(usersToPosts)
    .values(input)
    .onConflictDoUpdate({
      target: [usersToPosts.userId, usersToPosts.postId],
      set: { voteStatus: input.voteStatus },
    })
    .returning();
};

export const downvotePost = (
  input: Pick<UserToPost, "userId" | "postId" | "voteStatus">,
) => {
  return db
    .insert(usersToPosts)
    .values(input)
    .onConflictDoUpdate({
      target: [usersToPosts.userId, usersToPosts.postId],
      set: { voteStatus: input.voteStatus },
    })
    .returning();
};
