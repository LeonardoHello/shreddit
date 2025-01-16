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

export default async function Post({
  currentUserId,
  postId,
}: {
  currentUserId: User["id"] | null;
  postId: string;
}) {
  const post = await getPostById.execute({
    currentUserId,
    postId,
  });

  if (!post) notFound();

  return (
    <PostContextProvider post={post}>
      <div className="flex gap-3 rounded border bg-card p-2">
        {currentUserId && <PostVote />}
        {!currentUserId && <PostVotePlaceholder />}
        <div className="flex w-0 grow flex-col gap-1">
          <PostMetadata />
          <PostContent />
          {currentUserId && (
            <PostActions currentUserId={currentUserId}>
              <PostActionsDropdown />
            </PostActions>
          )}
          {!currentUserId && <PostActionsPlaceholder />}
        </div>
      </div>
    </PostContextProvider>
  );
}
