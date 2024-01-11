"use client";

import { memo } from "react";

import type { Post, User } from "@/lib/db/schema";
import type { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

import PostActions from "./PostActions";
import PostActionsDropdown from "./PostActionsDropdown";
import PostContent from "./PostContent";
import PostMetadata from "./PostMetadata";
import PostVote from "./PostVote";

type Props = {
  currentUserId: User["id"] | null;
  initialData: NonNullable<RouterOutput["getPost"]>;
  removePostFromQuery?: (postId: Post["id"]) => void;
};

export default memo(function Post({
  currentUserId,
  initialData,
  removePostFromQuery,
}: Props) {
  const { data: post } = trpc.getPost.useQuery(initialData.id, {
    initialData,
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
});
