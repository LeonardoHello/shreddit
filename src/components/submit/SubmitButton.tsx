"use client";

import { useTransition } from "react";
import { notFound, useRouter } from "next/navigation";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  ReducerAction,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { PostFile, PostFileSchema } from "@/db/schema/posts";
import { client } from "@/hono/client";
import { useUploadThing } from "@/lib/uploadthing";
import { PostType } from "@/types/enums";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

const postFileSchema = PostFileSchema.pick({
  key: true,
  url: true,
  name: true,
  thumbHash: true,
}).array();

const toastId = "loading_toast";

export default function SubmitButton({
  communityName,
}: {
  communityName: string;
}) {
  const { data: selectedCommunity } = useSuspenseQuery({
    queryKey: ["communities", communityName, "submit"],
    queryFn: async () => {
      const res = await client.communities[":communityName"].submit.$get({
        param: { communityName },
      });
      return res.json();
    },
  });

  if (!selectedCommunity) {
    notFound();
  }

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const { startUpload } = useUploadThing("imageUploader", {
    onBeforeUploadBegin: (files) => {
      dispatch({ type: ReducerAction.START_UPLOAD });

      return files;
    },
    onUploadProgress: (p) => {
      toast.info(<Progress value={p} />, {
        id: toastId,
        // in milliseconds
        duration: 99 * 1000,
      });
    },
    onClientUploadComplete: () => {
      dispatch({ type: ReducerAction.STOP_UPLOAD });

      toast.dismiss(toastId);
    },
    onUploadError: (e) => {
      dispatch({ type: ReducerAction.STOP_UPLOAD });

      toast.dismiss(toastId);
      toast.error(e.message);
    },
  });

  const createPost = useMutation({
    mutationFn: async (
      selectedFiles?: Pick<PostFile, "key" | "name" | "url" | "thumbHash">[],
    ) => {
      const res = await client.posts.$post({
        json: {
          ...state,
          files: selectedFiles,
          communityId: selectedCommunity.id,
        },
      });

      return res.json();
    },
    onMutate: () => {
      dispatch({ type: ReducerAction.START_LOADING });
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
      dispatch({ type: ReducerAction.STOP_LOADING });
    },
  });

  const isMutating =
    isPending || state.isUploading || state.isLoading || createPost.isPending;

  const isDisabled =
    isMutating ||
    state.title.length === 0 ||
    (state.postType === PostType.IMAGE && state.selectedFiles.length === 0);

  const handleSubmit = async () => {
    if (isDisabled) {
      toast.error(
        "Cannot submit the form. Please check all required fields and try again.",
      );

      return;
    }

    if (state.postType === PostType.TEXT) {
      createPost.mutate(undefined);
    } else {
      if (state.selectedFiles.length > 12) {
        toast.error("You can only upload up to 12 files.");
        return;
      }

      dispatch({ type: ReducerAction.START_LOADING });

      const uploadedFiles = await startUpload(
        state.selectedFiles.map((file) => file.file),
      );

      if (!uploadedFiles) {
        dispatch({ type: ReducerAction.STOP_LOADING });

        return;
      }

      const files = uploadedFiles.map((file) => ({
        name: file.name,
        key: file.key,
        url: file.ufsUrl,
      }));

      const response = await fetch("/api/thumbHash", {
        method: "POST",
        body: JSON.stringify(files),
      });

      const data = await response.json();

      const parsedFiles = postFileSchema.safeParse(data);

      if (parsedFiles.error) {
        toast.error(parsedFiles.error.message);
        dispatch({ type: ReducerAction.STOP_LOADING });

        return;
      }

      // text is set to null
      createPost.mutate(parsedFiles.data);
    }
  };

  return (
    <Button
      className="order-2 self-end rounded-full"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      onClick={handleSubmit}
    >
      {isMutating ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {state.isUploading ? "Uploading..." : "Posting..."}
        </>
      ) : (
        "Post"
      )}
    </Button>
  );
}
