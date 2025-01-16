"use client";

import { use, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getSelectedCommunity } from "@/api/getCommunity";
import {
  ReducerAction,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { trpc } from "@/trpc/client";
import { PostType } from "@/types";
import { cn } from "@/utils/cn";

export default function SubmitButton({
  selectedCommunityPromise,
}: {
  selectedCommunityPromise: ReturnType<typeof getSelectedCommunity.execute>;
}) {
  const selectedCommunity = use(selectedCommunityPromise);

  if (!selectedCommunity)
    throw new Error("There was a problem with a community selection.");

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const createPostText = trpc.post.createTextPost.useMutation({
    onMutate: () => {
      dispatch({ type: ReducerAction.DISABLE_SUBMIT });
    },
    onSuccess: (data) => {
      const post = data[0];

      startTransition(() => {
        router.push(`/r/${selectedCommunity.name}/comments/${post.id}`);
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      dispatch({ type: ReducerAction.ENABLE_SUBMIT });
    },
  });

  const createPostImage = trpc.post.createImagePost.useMutation({
    onMutate: () => {
      dispatch({ type: ReducerAction.DISABLE_SUBMIT });
    },
    onSuccess: (data) => {
      const post = data[0][0];

      startTransition(() => {
        router.push(`/r/${selectedCommunity.name}/comments/${post.id}`);
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      dispatch({ type: ReducerAction.ENABLE_SUBMIT });
    },
  });

  const isMutating =
    isPending || createPostText.isPending || createPostImage.isPending;

  const isDisabled =
    isMutating ||
    state.isDisabled ||
    state.title.length === 0 ||
    (state.postType === PostType.IMAGE && state.files.length === 0);

  return (
    <div className="flex flex-col items-end gap-4 p-4">
      <button
        className={cn(
          "inline-flex h-8 w-16 items-center justify-center gap-2 rounded-full bg-zinc-300 text-sm font-bold tracking-wide text-zinc-800 transition-opacity enabled:hover:opacity-80",
          {
            "cursor-not-allowed bg-zinc-400 text-zinc-700": isDisabled,
          },
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        onClick={() => {
          if (isDisabled) return;

          const { files, ...post } = state;

          if (state.postType === PostType.TEXT) {
            createPostText.mutate({
              ...post,
              communityId: selectedCommunity.id,
            });
          } else if (state.postType === PostType.IMAGE) {
            // text is set to null
            createPostImage.mutate({
              ...post,
              communityId: selectedCommunity.id,
              files,
            });
          }
        }}
      >
        {isMutating && <Loader2 className="size-4 animate-spin" />}
        {!isMutating && "Post"}
      </button>
    </div>
  );
}
