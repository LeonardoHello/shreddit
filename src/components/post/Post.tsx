"use client";

import { use } from "react";
import { notFound } from "next/navigation";

import { User } from "@clerk/nextjs/server";

import { getPostById } from "@/api/getPost";
import PostContextProvider from "@/context/PostContext";
import PostActions from "./PostActions";
import PostActionsDropdown from "./PostActionsDropdown";
import PostActionsPlaceholder from "./PostActionsPlaceholder";
import PostContent from "./PostContent";
import PostMetadata from "./PostMetadata";
import PostVote from "./PostVote";
import PostVotePlaceholder from "./PostVotePlaceholder";

export default function Post({
  currentUserId,
  postPromise,
}: {
  currentUserId: User["id"] | null;
  postPromise: ReturnType<typeof getPostById.execute>;
}) {
  const post = use(postPromise);

  if (!post) notFound();

  return (
    <PostContextProvider post={post}>
      <div className="flex gap-3 rounded bg-zinc-900 p-2">
        {currentUserId && <PostVote />}
        {!currentUserId && <PostVotePlaceholder />}
        <div className="flex w-0 grow flex-col gap-1">
          <PostMetadata />
          <PostContent />
          {currentUserId && (
            <PostActions>
              <PostActionsDropdown />
            </PostActions>
          )}
          {!currentUserId && <PostActionsPlaceholder />}
        </div>
      </div>
    </PostContextProvider>
  );
}
