import { useParams, usePathname, useRouter } from "next/navigation";

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
  const { username } = useParams();

  const state = usePostContext();

  if (state.isDeleted) {
    return (
      <div className="flex h-20 items-center gap-3 rounded border border-zinc-700/70 bg-zinc-900 p-4">
        <div className="font-semibold capitalize">post deleted</div>
      </div>
    );
  }

  // show hidden files only on user filter feed
  if (state.isHidden && !(username && pathname !== `/u/${username}`)) {
    return <FeedPostHidden />;
  }

  return (
    <div
      className="cursor-pointer rounded border border-zinc-700/70 hover:border-zinc-500"
      onClick={() => {
        router.push(`/r/${state.community.name}/comments/${state.id}`);
      }}
    >
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
    </div>
  );
}
