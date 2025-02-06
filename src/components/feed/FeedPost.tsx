import { usePathname, useRouter } from "next/navigation";

import { User } from "@clerk/nextjs/server";

import { usePostContext } from "@/context/PostContext";
import PostBody from "../post/PostBody";
import PostFooter from "../post/PostFooter";
import PostHeader from "../post/PostHeader";
import FeedPostHidden from "./FeedPostHidden";

export default function FeedPost({
  currentUserId,
}: {
  currentUserId: User["id"] | null;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const state = usePostContext();

  if (state.isDeleted) {
    return (
      <div className="flex h-20 items-center gap-3 rounded border bg-card p-4">
        <div className="font-semibold capitalize">post deleted</div>
      </div>
    );
  }

  // don't hide posts on user filter feed
  if (state.isHidden && !pathname.startsWith("/u/")) {
    return <FeedPostHidden />;
  }

  return (
    <div
      className="flex cursor-pointer flex-col gap-2 rounded border bg-card px-4 py-2 hover:border-ring/50"
      onTouchStart={() => {
        router.prefetch(`/r/${state.community.name}/comments/${state.id}`);
      }}
      onMouseEnter={() => {
        router.prefetch(`/r/${state.community.name}/comments/${state.id}`);
      }}
      onClick={() => {
        if (!state.isEditing) {
          router.push(`/r/${state.community.name}/comments/${state.id}#post`);
        }
      }}
    >
      <PostHeader currentUserId={currentUserId} />
      <PostBody />
      <PostFooter currentUserId={currentUserId} />
    </div>
  );
}
