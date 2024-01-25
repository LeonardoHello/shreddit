"use client";

import { memo } from "react";

import PostContextProvider from "@/lib/context/PostContextProvider";
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
    <PostContextProvider post={post}>
      <PostVote currentUserId={currentUserId} />
      <div className="flex grow flex-col gap-1.5">
        <PostMetadata />
        <PostContent />
        <PostActions
          currentUserId={currentUserId}
          removePostFromQuery={removePostFromQuery}
        >
          <PostActionsDropdown removePostFromQuery={removePostFromQuery} />
        </PostActions>
      </div>
    </PostContextProvider>
  );
});
