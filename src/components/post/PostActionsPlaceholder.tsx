"use client";

import { ClerkLoading, SignInButton } from "@clerk/nextjs";
import {
  BookmarkIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { usePostContext } from "@/context/PostContext";

export default function PostActionsPlaceholder() {
  const state = usePostContext();

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
      <button
        className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-zinc-700/50"
        onClick={(e) => {
          e.stopPropagation();
          copyLink(state.id);
        }}
      >
        <LinkIcon className="h-6 w-6" />
        <div className="hidden sm:block">copy link</div>
      </button>

      <ClerkLoading>
        <button
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-zinc-700/50"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <BookmarkIcon className="h-6 w-6" />
          <div className="hidden sm:block">save</div>
        </button>
        <button
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-zinc-700/50"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <EyeIcon className="h-6 w-6" />
          <div className="hidden sm:block">hide</div>
        </button>
      </ClerkLoading>

      <SignInButton mode="modal">
        <button
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-zinc-700/50"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <BookmarkIcon className="h-6 w-6" />
          <div className="hidden sm:block">save</div>
        </button>
      </SignInButton>
      <SignInButton mode="modal">
        <button
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-zinc-700/50"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <EyeIcon className="h-6 w-6" />
          <div className="hidden sm:block">hide</div>
        </button>
      </SignInButton>
    </div>
  );
}
