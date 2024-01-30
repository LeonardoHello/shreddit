"use client";

import {
  type ChangeEvent,
  useEffect,
  useReducer,
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import {
  CheckIcon,
  DocumentTextIcon,
  PhotoIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  DocumentTextIcon as DocumentTextIconSolid,
  PhotoIcon as PhotoIconSolid,
} from "@heroicons/react/24/solid";
import { toast } from "sonner";

import { useSubmitContext } from "@/lib/context/SubmitContextProvider";
import type { Post } from "@/lib/db/schema";
import cn from "@/lib/utils/cn";
import { UploadDropzone } from "@/lib/utils/uploadthing";
import { trpc } from "@/trpc/react";

import PostRTE from "../RTE/PostRTE";

type InitialReducerState = Omit<
  Post,
  "createdAt" | "updatedAt" | "id" | "communityId" | "authorId"
> &
  Partial<Pick<Post, "communityId">>;

enum REDUCER_ACTION_TYPE {
  CHANGED_COMMUNITY,
  CHANGED_TITLE,
  CHANGED_TEXT,
  TOGGLED_SPOILER,
  TOGGLED_NSFW,
}

type ReducerAction = {
  [K in REDUCER_ACTION_TYPE]: K extends REDUCER_ACTION_TYPE.CHANGED_TITLE
    ? { type: K; nextTitle: InitialReducerState["title"] }
    : K extends REDUCER_ACTION_TYPE.CHANGED_COMMUNITY
    ? { type: K; nextCommunityId: InitialReducerState["communityId"] }
    : K extends REDUCER_ACTION_TYPE.CHANGED_TEXT
    ? { type: K; nextText: InitialReducerState["text"] }
    : { type: K };
}[REDUCER_ACTION_TYPE];

function reducer(
  state: InitialReducerState,
  action: ReducerAction,
): InitialReducerState {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.CHANGED_COMMUNITY:
      return {
        ...state,
        communityId: action.nextCommunityId,
      };

    case REDUCER_ACTION_TYPE.CHANGED_TITLE:
      return {
        ...state,
        title: action.nextTitle,
      };

    case REDUCER_ACTION_TYPE.CHANGED_TEXT:
      return {
        ...state,
        text: action.nextText,
      };

    case REDUCER_ACTION_TYPE.TOGGLED_SPOILER:
      return {
        ...state,
        spoiler: !state.spoiler,
      };

    case REDUCER_ACTION_TYPE.TOGGLED_NSFW:
      return {
        ...state,
        nsfw: !state.nsfw,
      };

    default:
      throw Error("Unknown action");
  }
}

const maxTitleLength = 300;

export default function PostSubmit({
  initialMediaSubmit,
}: {
  initialMediaSubmit: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [mediaSubmit, setMediaSubmit] = useState(initialMediaSubmit);
  const [state, dispatch] = useReducer(reducer, {
    communityId: undefined,
    title: "",
    text: null,
    nsfw: false,
    spoiler: false,
  });

  const { selectedCommunity } = useSubmitContext();

  useEffect(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.CHANGED_COMMUNITY,
      nextCommunityId: selectedCommunity?.id,
    });
  }, [selectedCommunity]);

  const createPost = trpc.createPost.useMutation({
    onSuccess: (data) => {
      startTransition(() => {
        router.push(`/r/${selectedCommunity?.name}/comments/${data[0].id}`);
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isMutating = isPending || createPost.isLoading;

  const disabled = isMutating || !state.communityId || state.title.length === 0;

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: REDUCER_ACTION_TYPE.CHANGED_TITLE,
      nextTitle: e.currentTarget.value,
    });
  }

  function handleSpoilerToggle() {
    dispatch({
      type: REDUCER_ACTION_TYPE.TOGGLED_SPOILER,
    });
  }

  function handleNsfwToggle() {
    dispatch({
      type: REDUCER_ACTION_TYPE.TOGGLED_NSFW,
    });
  }

  function handleTextChange(nextText: InitialReducerState["text"]) {
    dispatch({
      type: REDUCER_ACTION_TYPE.CHANGED_TEXT,
      nextText,
    });
  }

  return (
    <div className="bg-zinc-900 text-sm">
      <div className="flex font-bold">
        <button
          className={cn(
            "flex basis-1/2 items-center justify-center gap-1.5 border-b border-b-zinc-700/70 py-3 capitalize text-zinc-500 hover:bg-zinc-700/30",
            {
              "border-b-2 border-b-zinc-300 bg-zinc-700/30 text-zinc-300":
                !mediaSubmit,
            },
          )}
          onClick={() => {
            if (mediaSubmit) {
              setMediaSubmit(false);
            }
          }}
        >
          {mediaSubmit && <DocumentTextIcon className="h-6 w-6" />}
          {!mediaSubmit && <DocumentTextIconSolid className="h-6 w-6" />}
          post
        </button>
        <button
          className={cn(
            "flex basis-1/2 items-center justify-center gap-1.5 border-b border-l border-b-zinc-700/70 border-l-zinc-700/70 py-3 capitalize text-zinc-500 hover:bg-zinc-700/30",
            {
              "border-b-2 border-b-zinc-300 bg-zinc-700/30 text-zinc-300":
                mediaSubmit,
            },
          )}
          onClick={() => {
            if (!mediaSubmit) {
              handleTextChange(null);
              setMediaSubmit(true);
            }
          }}
        >
          {mediaSubmit && <PhotoIconSolid className="h-6 w-6" />}
          {!mediaSubmit && <PhotoIcon className="h-6 w-6" />}
          images
        </button>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center">
            <input
              placeholder="Title"
              maxLength={maxTitleLength}
              autoComplete="off"
              className="w-full min-w-0 overflow-y-hidden rounded bg-inherit py-2.5 pl-4 pr-16 text-zinc-300 outline-none ring-1 ring-inset ring-zinc-700/70 focus:ring-zinc-300 "
              onChange={handleTitleChange}
            />
            <div className="absolute right-3 text-2xs font-bold text-zinc-500">
              {state.title.length}/{maxTitleLength}
            </div>
          </div>
          {!mediaSubmit && <PostRTE handleTextChange={handleTextChange} />}
          {mediaSubmit && (
            <UploadDropzone
              endpoint="imageUploader"
              className="mt-0 rounded border border-zinc-700/70"
              onClientUploadComplete={(res) => {
                console.log(res);
              }}
              onBeforeUploadBegin={(files) => {
                console.log(files);
                return files;
              }}
            />
          )}
        </div>
        <div className="flex items-center gap-2 font-bold text-zinc-400">
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-full border border-zinc-500 px-3.5 py-1 capitalize tracking-wide",
              { "border-zinc-950 bg-zinc-950 text-zinc-300": state.spoiler },
            )}
            onClick={handleSpoilerToggle}
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
            onClick={handleNsfwToggle}
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
            if (state.communityId) {
              createPost.mutate({ ...state, communityId: state.communityId });
            }
          }}
        >
          {isMutating ? "posting..." : "post"}
        </button>
      </div>
    </div>
  );
}
