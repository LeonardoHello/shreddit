"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { getSelectedCommunity } from "@/api/getCommunity";
import {
  REDUCER_ACTION_TYPE,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { trpc } from "@/trpc/client";
import { PostType } from "@/types";
import cn from "@/utils/cn";

export default function SubmitActionButton({
  selectedCommunity,
}: {
  selectedCommunity?: Awaited<ReturnType<typeof getSelectedCommunity.execute>>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const createPostText = trpc.createPostText.useMutation({
    onMutate: () => {
      dispatch({ type: REDUCER_ACTION_TYPE.DISABLED_UPLOAD });
    },
    onSuccess: (data) => {
      const post = data[0];

      startTransition(() => {
        router.push(`/r/${selectedCommunity?.name}/comments/${post.id}`);
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      dispatch({ type: REDUCER_ACTION_TYPE.ENABLED_UPLOAD });
    },
  });

  const createPostImage = trpc.createPostImage.useMutation({
    onMutate: () => {
      dispatch({ type: REDUCER_ACTION_TYPE.DISABLED_UPLOAD });
    },
    onSuccess: (data) => {
      const post = data[0][0];

      startTransition(() => {
        router.push(`/r/${selectedCommunity?.name}/comments/${post.id}`);
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      dispatch({ type: REDUCER_ACTION_TYPE.ENABLED_UPLOAD });
    },
  });

  const isMutating =
    createPostText.isPending || createPostImage.isPending || isPending;

  const disabled =
    isMutating ||
    state.isDisabled ||
    state.title.length === 0 ||
    !selectedCommunity ||
    (state.type === PostType.IMAGE && state.files.length === 0);

  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        className={cn(
          "self-end rounded-full bg-zinc-300 px-5 py-1.5 font-bold capitalize tracking-wide text-zinc-900 transition-colors hover:bg-zinc-400",
          { "cursor-not-allowed bg-zinc-400": disabled },
        )}
        disabled={disabled}
        onClick={() => {
          if (!selectedCommunity || disabled) return;

          const { files, ...post } = state;

          if (state.type === PostType.TEXT) {
            createPostText.mutate({
              ...post,
              communityId: selectedCommunity.id,
            });
          }

          if (state.type === PostType.IMAGE) {
            createPostImage.mutate({
              ...post,
              communityId: selectedCommunity.id,
              files,
            });
          }
        }}
      >
        {isMutating ? "posting..." : "post"}
      </button>
    </div>
  );
}
