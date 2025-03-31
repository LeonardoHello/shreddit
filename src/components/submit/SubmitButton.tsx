"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  ReducerAction,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { useTRPC } from "@/trpc/client";
import { PostType } from "@/types/enums";
import { Button } from "../ui/button";

export default function SubmitButton({
  communityName,
}: {
  communityName: string;
}) {
  const trpc = useTRPC();

  const { data: selectedCommunity } = useSuspenseQuery(
    trpc.community.getSelectedCommunity.queryOptions(communityName),
  );

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const createPostText = useMutation(
    trpc.post.createTextPost.mutationOptions({
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
    }),
  );

  const createPostImage = useMutation(
    trpc.post.createImagePost.mutationOptions({
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
    }),
  );

  const isMutating =
    isPending || createPostText.isPending || createPostImage.isPending;

  const isDisabled =
    isMutating ||
    state.isDisabled ||
    state.title.length === 0 ||
    (state.postType === PostType.IMAGE && state.files.length === 0);

  return (
    <Button
      className="order-2 self-end rounded-full"
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
    </Button>
  );
}
