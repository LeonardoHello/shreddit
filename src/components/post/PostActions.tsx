"use client";

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

import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import useDropdown from "@/hooks/useDropdown";
import { trpc } from "@/trpc/client";

export default function PostActions({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dropdownRef, isOpen, setIsOpen } = useDropdown();

  const state = usePostContext();
  const dispatch = usePostDispatchContext();

  const savePost = trpc.savePost.useMutation({
    onMutate: (variables) => {
      dispatch({
        type: ReducerAction.SET_SAVE,
        save: variables.saved,
      });
    },
    onSuccess: (data) => {
      if (data[0].saved) {
        toast.success("Post saved successfully.");
      } else {
        toast.success("Post unsaved successfully.");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const hidePost = trpc.hidePost.useMutation({
    onMutate: (variables) => {
      dispatch({
        type: ReducerAction.SET_HIDE,
        hide: variables.hidden,
      });
    },
    onSuccess: (data) => {
      if (data[0].hidden) {
        toast.success("Post hidden successfully.");
      } else {
        toast.success("Post unhidden successfully.");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const copyLink = async (postId: string) => {
    const origin = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";

    await navigator.clipboard.writeText(
      `${origin}/r/${state.community.name}/comments/${postId}`,
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
        }).format(state.commentCount)}{" "}
        <span className="hidden sm:block">comments</span>
      </div>
      <div
        className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-zinc-700/50"
        onClick={(e) => {
          e.stopPropagation();
          copyLink(state.id);
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
            postId: state.id,
            saved: !state.isSaved,
          });
        }}
      >
        {state.isSaved ? (
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
            postId: state.id,
            hidden: !state.isHidden,
          });
        }}
      >
        {state.isHidden ? (
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
    </div>
  );
}
