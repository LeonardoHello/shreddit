import { usePathname, useRouter } from "next/navigation";

import { User } from "@clerk/nextjs/server";

import { usePostContext } from "@/context/PostContext";
import PostActions from "../post/PostActions";
import PostActionsDropdown from "../post/PostActionsDropdown";
import PostActionsPlaceholder from "../post/PostActionsPlaceholder";
import PostContent from "../post/PostContent";
import PostMetadata from "../post/PostMetadata";
import PostVote from "../post/PostVote";
import PostVotePlaceholder from "../post/PostVotePlaceholder";
import FeedPostHidden from "./FeedPostHidden";

export default function FeedPost({
  currentUserId,
}: {
  currentUserId: User["id"] | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const state = usePostContext();

  if (state.isDeleted) {
    return (
      <div className="flex h-20 items-center gap-3 rounded border bg-card p-4">
        <div className="font-semibold capitalize">post deleted</div>
      </div>
    );
  }

  // don't hide posts on user filter feed
  if (
    state.isHidden &&
    !(
      pathname.endsWith("/downvoted") ||
      pathname.endsWith("/hidden") ||
      pathname.endsWith("/saved") ||
      pathname.endsWith("/upvoted")
    )
  ) {
    return <FeedPostHidden />;
  }

  return (
    <div
      className="flex cursor-pointer gap-3 rounded bg-card p-2 hover:border-ring"
      onClick={() => {
        router.push(`/r/${state.community.name}/comments/${state.id}`);
      }}
    >
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
  );
}
