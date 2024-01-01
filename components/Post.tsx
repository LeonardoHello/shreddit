"use client";

import type { Post, User } from "@/lib/db/schema";
import type { InfiniteQueryPost } from "@/lib/types";
import { trpc } from "@/trpc/react";

import PostActions from "./PostActions";
import PostActionsDropdown from "./PostActionsDropdown";
import PostContent from "./PostContent";
import PostMetadata from "./PostMetadata";
import PostVote from "./PostVote";

type Props = {
  currentUserId: User["id"] | null;
  initialPost: InfiniteQueryPost;
  removePostFromQuery?: (postId: Post["id"]) => void;
};

export default function Post({
  currentUserId,
  initialPost,
  removePostFromQuery,
}: Props) {
  const { data: post } = trpc.getPost.useQuery(initialPost.id, {
    initialData: initialPost,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (!post) throw new Error("Couldn't fetch post information");

  return (
    <>
      <PostVote currentUserId={currentUserId} post={post} />
      <div className="flex grow flex-col gap-1.5">
        <PostMetadata post={post} />
        <PostContent post={post} />
        <PostActions
          currentUserId={currentUserId}
          post={post}
          removePostFromQuery={removePostFromQuery}
        >
          <PostActionsDropdown
            post={post}
            removePostFromQuery={removePostFromQuery}
          />
        </PostActions>
      </div>
    </>
  );
}
