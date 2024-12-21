"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { getSelectedCommunity } from "@/api/getCommunity";
import {
  REDUCER_ACTION_TYPE,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { trpc } from "@/trpc/client";
import { SubmitType } from "@/types";
import cn from "@/utils/cn";

export default function SubmitActionButton({
  selectedCommunity,
  currentType,
}: {
  selectedCommunity?: Awaited<ReturnType<typeof getSelectedCommunity.execute>>;
  currentType: SubmitType;
}) {
  const router = useRouter();

  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const createPost = trpc.createPost.useMutation({
    onMutate: () => {
      dispatch({ type: REDUCER_ACTION_TYPE.STARTED_MUTATE });
    },
    onSuccess: (data) => {
      const [post] = data[0];

      router.push(`/r/${selectedCommunity?.name}/comments/${post.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      dispatch({ type: REDUCER_ACTION_TYPE.STOP_MUTATE });
    },
  });

  const disabled =
    (currentType === SubmitType.TEXT && state.text === null) ||
    (currentType === SubmitType.IMAGE && state.files.length === 0) ||
    !selectedCommunity ||
    state.isMutating ||
    state.isUploading ||
    state.title.length === 0;

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

          const postId = uuidv4();

          if (currentType === SubmitType.TEXT) {
            const filterFiles = state.filesRTE.filter((file) =>
              state.text?.includes(`<img src="${file.url}" alt="${file.name}"`),
            );

            const files = filterFiles.map((file) => ({
              ...file,
              postId,
            }));

            createPost.mutate({
              post: {
                ...state,
                id: uuidv4(),
                communityId: selectedCommunity.id,
              },
              files,
            });
          } else if (currentType === SubmitType.IMAGE) {
            const files = state.files.map((file) => ({
              ...file,
              postId,
            }));

            createPost.mutate({
              post: {
                ...state,
                id: uuidv4(),
                communityId: selectedCommunity.id,
                text: null,
              },
              files,
            });
          }
        }}
      >
        {state.isMutating ? "posting..." : "post"}
      </button>
    </div>
  );
}
