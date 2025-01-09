"use client";

import { useParams, useRouter } from "next/navigation";

import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import {
  ReducerAction,
  usePostContext,
  usePostDispatchContext,
} from "@/context/PostContext";
import { trpc } from "@/trpc/client";
import { cn } from "@/utils/cn";

export default function PostActionsDropdown() {
  const { postId } = useParams();
  const router = useRouter();

  const post = usePostContext();
  const dispatch = usePostDispatchContext();

  const updateSpoiler = trpc.post.setPostSpoiler.useMutation({
    onMutate: (variables) => {
      dispatch({
        type: ReducerAction.SET_SPOILER,
        spoiler: variables.spoiler,
      });
    },
    onSuccess: (data) => {
      if (data[0].spoiler) {
        toast.success("Post has been marked as spoiler");
      } else {
        toast.success("Post has been un-marked as a spoiler");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateNSFW = trpc.post.setPostNSFW.useMutation({
    onMutate: (variables) => {
      dispatch({
        type: ReducerAction.SET_NSFW,
        nsfw: variables.nsfw,
      });
    },
    onSuccess: (data) => {
      if (data[0].nsfw) {
        toast.success("Post has been marked as spoiler");
      } else {
        toast.success("Post has been un-marked as a spoiler");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deletedPost = trpc.post.deletePost.useMutation({
    onMutate: () => {
      dispatch({ type: ReducerAction.DELETE });
    },
    onSuccess: () => {
      if (postId) {
        router.replace("/");
      }

      toast.success("Post deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div
      className={cn(
        "absolute right-4 z-10 flex w-48 flex-col self-end border border-zinc-700/70 bg-zinc-900 text-sm font-medium shadow-[0_2px_4px_0] shadow-zinc-300/20 md:right-auto",
        { "pointer-events-none opacity-40": deletedPost.isPending },
      )}
    >
      <div
        className="flex items-center gap-2 border-b border-zinc-700/70 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={() => {
          if (updateSpoiler.isPending) return;

          updateSpoiler.mutate({
            id: post.id,
            spoiler: !post.spoiler,
          });
        }}
      >
        <CheckIcon
          className={cn(
            "h-5 w-5 rounded-sm border-2 border-zinc-600 stroke-2",
            { "stroke-transparent": !post.spoiler },
          )}
        />
        Mark As Spoiler
      </div>

      <div
        className="flex items-center gap-2 border-b border-zinc-700/70 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={() => {
          if (updateNSFW.isPending) return;

          updateNSFW.mutate({
            id: post.id,
            nsfw: !post.nsfw,
          });
        }}
      >
        <CheckIcon
          className={cn(
            "h-5 w-5 rounded-sm border-2 border-zinc-600 stroke-2",
            { "stroke-transparent": !post.nsfw },
          )}
        />
        Mark As NSFW
      </div>

      {post.files.length === 0 && (
        <div
          className="flex items-center gap-2 border-b border-zinc-700/70 px-1.5 py-2 hover:bg-zinc-700/50"
          onClick={() => {
            dispatch({ type: ReducerAction.TOGGLE_EDIT });
          }}
        >
          <PencilSquareIcon className="h-5 w-5" /> Edit
        </div>
      )}

      <div
        className="flex items-center gap-2 px-1.5 py-2 hover:bg-zinc-700/50"
        onClick={() => {
          if (deletedPost.isPending) return;

          deletedPost.mutate(post.id);
        }}
      >
        <TrashIcon className="h-5 w-5" /> Delete
      </div>
    </div>
  );
}
