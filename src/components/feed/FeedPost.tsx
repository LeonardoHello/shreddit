import { usePathname, useRouter } from "next/navigation";

import { User } from "@clerk/nextjs/server";

import { usePostContext } from "@/context/PostContext";
import PostActions from "../post/PostActions";
import PostContent from "../post/PostContent";
import PostDropdown from "../post/PostDropdown";
import PostHeader from "../post/PostHeader";
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
      className="flex cursor-pointer flex-col gap-2 rounded border bg-card px-4 py-2 hover:border-ring/50"
      onMouseEnter={() => {
        router.prefetch(`/r/${state.community.name}/comments/${state.id}`);
      }}
      onClick={() => {
        router.push(`/r/${state.community.name}/comments/${state.id}`);
      }}
    >
      <PostHeader>
        {currentUserId && <PostDropdown currentUserId={currentUserId} />}
      </PostHeader>
      <PostContent />
      <PostActions>
        {currentUserId ? <PostVote /> : <PostVotePlaceholder />}
      </PostActions>
    </div>
  );
}
