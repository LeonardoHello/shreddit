import { usePathname, useRouter } from "next/navigation";

import { usePostContext } from "@/context/PostContext";
import { User } from "@/db/schema/users";
import { cn } from "@/lib/cn";
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
      <div className="bg-card flex h-20 items-center gap-3 rounded border p-4">
        <div className="font-semibold capitalize">post deleted</div>
      </div>
    );
  }

  // don't hide posts on user filter feed
  if (state.hidden && !pathname.startsWith("/u/")) {
    return <FeedPostHidden />;
  }

  return (
    <div
      className={cn(
        "bg-card hover:border-ring/50 flex flex-col gap-2 rounded-lg border px-4 py-2",
        {
          "cursor-pointer": !state.isEditing,
        },
      )}
      onTouchStart={() => {
        router.prefetch(`/r/${state.community.name}/comments/${state.id}`);
      }}
      onMouseEnter={() => {
        router.prefetch(`/r/${state.community.name}/comments/${state.id}`);
      }}
      onClick={() => {
        if (!state.isEditing) {
          router.push(`/r/${state.community.name}/comments/${state.id}`);
        }
      }}
    >
      <PostHeader currentUserId={currentUserId} />
      <PostBody />
      <PostFooter currentUserId={currentUserId} />
    </div>
  );
}
