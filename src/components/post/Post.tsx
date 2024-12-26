"use client";

import { Suspense } from "react";

import type { Post, User } from "@/db/schema";
import PostActions from "./PostActions";
import PostActionsDropdown from "./PostActionsDropdown";
import PostContent from "./PostContent";
import PostMetadata from "./PostMetadata";
import PostVote from "./PostVote";

export default function Post({
  currentUserId,
}: {
  currentUserId: User["id"] | null;
  removePostFromQuery?: (postId: Post["id"]) => Promise<void>;
}) {
  return (
    <div className="flex gap-3 rounded bg-zinc-900 p-2">
      <PostVote currentUserId={currentUserId} />
      <div className="flex w-0 grow flex-col gap-1">
        <PostMetadata />
        <PostContent />
        <Suspense>
          <PostActions currentUserId={currentUserId}>
            <PostActionsDropdown />
          </PostActions>
        </Suspense>
      </div>
    </div>
  );
}
