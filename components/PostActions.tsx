import {
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import type { User } from "@/lib/db/schema";
import useDropdown from "@/lib/hooks/useDropdown";
import type { InfinteQueryPost } from "@/types";

export default function PostActions({
  post,
  currentUserId,
  children,
}: {
  post: InfinteQueryPost;
  currentUserId: User["id"] | null;
  children: React.ReactNode;
}) {
  const { dropdownRef, isOpen, setIsOpen } = useDropdown();

  const copyLink = async (communityName: string, postId: string) => {
    const origin = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";

    const path = `r/${communityName}/comments/${postId}`;

    await navigator.clipboard.writeText(`${origin}/${path}`);
    toast.success("Copied link!");
  };

  return (
    <div className="flex select-none items-center gap-2 text-xs font-bold text-zinc-500">
      <div className="flex items-center gap-1">
        <ChatBubbleLeftIcon className="h-6 w-6" />
        {post.commentCount} comments
      </div>
      <div
        className="flex items-center gap-1 rounded px-2 py-1 hover:bg-zinc-700/50"
        onClick={() => copyLink(post.community.name, post.id)}
      >
        <LinkIcon className="h-6 w-6" />
        Copy Link
      </div>
      {post.authorId === currentUserId && (
        <div ref={dropdownRef} className="relative">
          <EllipsisHorizontalIcon
            className="h-6 w-6 rounded hover:bg-zinc-700/50"
            onClick={() => setIsOpen((prev) => !prev)}
          />
          {isOpen && children}
        </div>
      )}
    </div>
  );
}
