"use client";

import { useRouter } from "next/navigation";

import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import {
  REDUCER_ACTION_TYPE,
  useSubmitContext,
} from "@/context/SubmitContextProvider";
import { trpc } from "@/trpc/react";
import cn from "@/utils/cn";
import RTEPost from "../RTE/RTEPost";
import Dropzone from "./SubmitDropzone";

const maxTitleLength = 300;

export default function SubmitContent() {
  const router = useRouter();

  const { state, dispatch } = useSubmitContext();

  const createFiles = trpc.createFile.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createPost = trpc.createPost.useMutation({
    onMutate: () => {
      dispatch({ type: REDUCER_ACTION_TYPE.STARTED_MUTATE });
    },
    onSuccess: (data) => {
      let files = state.files;

      if (!state.isMediaSubmit) {
        files = state.files.filter((file) =>
          state.text?.includes(`<img src="${file.url}" alt="${file.name}">`),
        );
      }

      if (files.length > 0) {
        const filesToInsert = files.map((file) => ({
          ...file,
          postId: data[0].id,
        }));

        createFiles.mutate(filesToInsert);
      }

      router.push(`/r/${state.community?.name}/comments/${data[0].id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const disabled =
    state.isMutating ||
    state.isUploading ||
    !state.community?.id ||
    state.title.length === 0 ||
    (!state.text && state.files.length === 0);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center">
          <input
            placeholder="Title"
            maxLength={maxTitleLength}
            autoComplete="off"
            className="w-full min-w-0 overflow-y-hidden rounded bg-inherit py-2.5 pl-4 pr-16 text-zinc-300 outline-none ring-1 ring-inset ring-zinc-700/70 focus:ring-zinc-300"
            onChange={(e) => {
              dispatch({
                type: REDUCER_ACTION_TYPE.CHANGED_TITLE,
                nextTitle: e.currentTarget.value,
              });
            }}
          />
          <div className="absolute right-3 text-2xs font-bold text-zinc-500">
            {state.title.length}/{maxTitleLength}
          </div>
        </div>
        {!state.isMediaSubmit && <RTEPost />}
        {state.isMediaSubmit && <Dropzone />}
      </div>

      <div className="flex items-center gap-2 font-bold text-zinc-400">
        <button
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-zinc-500 px-3.5 py-1 capitalize tracking-wide",
            { "border-zinc-950 bg-zinc-950 text-zinc-300": state.spoiler },
          )}
          onClick={() => {
            dispatch({ type: REDUCER_ACTION_TYPE.TOGGLED_SPOILER });
          }}
        >
          {state.spoiler && <CheckIcon className="h-6 w-6 rotate-6" />}
          {!state.spoiler && <PlusIcon className="h-6 w-6" />}
          spoiler
        </button>
        <button
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-zinc-500 px-3.5 py-1 uppercase tracking-wide",
            { "border-rose-500 bg-rose-500 text-zinc-900": state.nsfw },
          )}
          onClick={() => {
            dispatch({ type: REDUCER_ACTION_TYPE.TOGGLED_NSFW });
          }}
        >
          {state.nsfw && <CheckIcon className="h-6 w-6 rotate-6" />}
          {!state.nsfw && <PlusIcon className="h-6 w-6" />}
          nsfw
        </button>
      </div>

      <hr className="border-zinc-700/70" />

      <button
        className={cn(
          "self-end rounded-full bg-zinc-300 px-5 py-1.5 font-bold capitalize tracking-wide text-zinc-900 transition-colors hover:bg-zinc-400",
          { "cursor-not-allowed bg-zinc-400": disabled },
        )}
        disabled={disabled}
        onClick={() => {
          const { community, ...rest } = state;
          if (community) {
            createPost.mutate({ ...rest, communityId: community.id });
          }
        }}
      >
        {state.isMutating ? "posting..." : "post"}
      </button>
    </div>
  );
}
