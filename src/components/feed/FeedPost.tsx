import { usePathname, useRouter } from "next/navigation";

import { User } from "@clerk/nextjs/server";

import { usePostContext } from "@/context/PostContext";
import { trpc } from "@/trpc/client";
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

  const utils = trpc.useUtils();
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

  const prefetchPost = () => {
    router.prefetch(`/r/${state.community.name}/comments/${state.id}`);

    const post = utils.post.getPost;
    const comments = utils.comment.getComments;
    const communityByName = utils.community.getCommunityByName;

    if (!post.getData(state.id)) {
      void post.prefetch(state.id);
    }
    if (!comments.getData(state.id)) {
      void comments.prefetch(state.id);
    }
    if (!communityByName.getData(state.community.name)) {
      void communityByName.prefetch(state.community.name);
    }
  };

  return (
    <div
      className="flex cursor-pointer flex-col gap-2 rounded border bg-card px-4 py-2 hover:border-ring/50"
      onTouchStart={prefetchPost}
      onMouseEnter={prefetchPost}
      onClick={() => {
        router.push(`/r/${state.community.name}/comments/${state.id}`);
      }}
    >
      <PostHeader currentUserId={currentUserId} />
      <PostBody />
      <PostFooter currentUserId={currentUserId} />
    </div>
  );
}
