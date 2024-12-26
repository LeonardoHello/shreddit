import { useSearchParams } from "next/navigation";

import {
  BookmarkIcon,
  BookmarkSlashIcon,
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  EyeSlashIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { usePostContext } from "@/context/PostContext";
import type { Post, User } from "@/db/schema";
import useDropdown from "@/hooks/useDropdown";
import { trpc } from "@/trpc/client";

type Props = {
  currentUserId: User["id"] | null;
  removePostFromQuery?: (postId: Post["id"]) => void;
  children: React.ReactNode;
};

export default function PostActions({
  currentUserId,
  removePostFromQuery,
  children,
}: Props) {
  const searchParams = useSearchParams();
  const utils = trpc.useUtils();

  const { dropdownRef, isOpen, setIsOpen } = useDropdown();
  const post = usePostContext();

  const userToPost = post.usersToPosts.findLast(
    (userToPost) => userToPost.userId === currentUserId,
  );

  const savePost = trpc.savePost.useMutation({
    onError: async (error) => {
      if (error.message !== "UNAUTHORIZED") {
        await utils["getPost"].refetch(post.id, {}, { throwOnError: true });
      }

      toast.error(error.message);
    },
    onSuccess: (data) => {
      if (data[0].saved) {
        toast.success("Post saved successfully.");
      } else {
        toast.success("Post unsaved successfully.");
      }
    },
  });

  const hidePost = trpc.hidePost.useMutation({
    onError: async (error) => {
      if (error.message !== "UNAUTHORIZED") {
        await utils["getPost"].refetch(post.id, {}, { throwOnError: true });
      }

      toast.error(error.message);
    },
    onSuccess: (data) => {
      if (removePostFromQuery !== undefined && !searchParams.get("filter")) {
        removePostFromQuery(post.id);
      }

      if (data[0].saved) {
        toast.success("Post hidden successfully.");
      } else {
        toast.success("Post unhidden successfully.");
      }
    },
  });

  const copyLink = async (postId: string) => {
    const origin = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";

    await navigator.clipboard.writeText(
      `${origin}/r/${post.community.name}/comments/${postId}`,
    );
    toast.success("Copied link!");
  };

  return (
    <div className="flex select-none items-center gap-2 text-xs font-bold capitalize text-zinc-500">
      <div className="flex items-center gap-1">
        <ChatBubbleLeftIcon className="h-6 w-6" />
        {new Intl.NumberFormat("en-US", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(post.commentCount)}{" "}
        <span className="hidden sm:block">comments</span>
      </div>
      <div
        className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-zinc-700/50"
        onClick={(e) => {
          e.stopPropagation();
          copyLink(post.id);
        }}
      >
        <LinkIcon className="h-6 w-6" />
        <div className="hidden sm:block">copy link</div>
      </div>
      <div
        className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-zinc-700/50"
        onClick={(e) => {
          e.stopPropagation();

          savePost.mutate({
            postId: post.id,
            saved: !userToPost?.saved,
          });
        }}
      >
        {userToPost?.saved ? (
          <>
            <BookmarkSlashIcon className="h-6 w-6" />
            <div className="hidden sm:block">unsave</div>
          </>
        ) : (
          <>
            <BookmarkIcon className="h-6 w-6" />
            <div className="hidden sm:block">save</div>
          </>
        )}
      </div>
      <div
        className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-zinc-700/50"
        onClick={(e) => {
          e.stopPropagation();

          hidePost.mutate({
            postId: post.id,
            hidden: !userToPost?.hidden,
          });
        }}
      >
        {userToPost?.hidden ? (
          <>
            <EyeSlashIcon className="h-6 w-6" />
            <div className="hidden sm:block">unhide</div>
          </>
        ) : (
          <>
            <EyeIcon className="h-6 w-6" />
            <div className="hidden sm:block">hide</div>
          </>
        )}
      </div>
      {post.authorId === currentUserId && (
        <div
          ref={dropdownRef}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
          <EllipsisHorizontalIcon className="h-6 w-6 rounded hover:bg-zinc-700/50" />
          {isOpen && children}
        </div>
      )}
    </div>
  );
}
