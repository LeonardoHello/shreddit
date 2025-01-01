"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";

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

import {
  ReducerAction,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { PostType } from "@/types";
import { cn } from "@/utils/cn";

const RTEPost = dynamic(() => import("@/components/RTE/RTEPost"));
const SubmitDropzone = dynamic(
  () => import("@/components/submit/SubmitDropzone"),
);

const componentMap: Record<PostType, React.ComponentType> = {
  [PostType.TEXT]: RTEPost,
  [PostType.IMAGE]: SubmitDropzone,
};

const icons: Record<
  PostType,
  { selected: React.JSX.Element; unselected: React.JSX.Element }
> = {
  [PostType.TEXT]: {
    selected: <DocumentTextIconSolid className="size-6" />,
    unselected: <DocumentTextIcon className="size-6" />,
  },
  [PostType.IMAGE]: {
    selected: <PhotoIconSolid className="size-6" />,
    unselected: <PhotoIcon className="size-6" />,
  },
};

const maxTitleLength = 300;

export default function SubmitTabs() {
  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  return (
    <div className="flex flex-col">
      <div className="flex gap-px rounded-t bg-zinc-800 font-bold">
        {Object.values(PostType).map((type, index, arr) => (
          <button
            key={type}
            disabled={state.isDisabled}
            className={cn(
              "flex basis-1/2 items-center justify-center gap-1.5 border-b border-b-zinc-700/70 bg-zinc-900 py-3 capitalize text-zinc-500 hover:bg-zinc-700/30",
              {
                "border-b-2 border-b-zinc-300 text-zinc-300":
                  type === state.postType,
                "cursor-not-allowed hover:bg-inherit": state.isDisabled,
                "rounded-tl": index === 0,
                "rounded-tr": index === arr.length - 1,
              },
            )}
            onClick={() => {
              if (type === state.postType || state.isDisabled) return;

              dispatch({
                type: ReducerAction.SET_POST_TYPE,
                postType: type,
              });
            }}
          >
            {type === state.postType && icons[type]["selected"]}
            {type !== state.postType && icons[type]["unselected"]}

            <span className="capitalize">{type.toLowerCase()}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="relative flex items-center">
          <input
            placeholder="Title"
            defaultValue={state.title}
            maxLength={maxTitleLength}
            autoComplete="off"
            className="w-full min-w-0 overflow-y-hidden rounded bg-inherit py-2.5 pl-4 pr-16 text-zinc-300 outline-none ring-1 ring-inset ring-zinc-700/70 focus:ring-zinc-300"
            onChange={(e) => {
              dispatch({
                type: ReducerAction.SET_TITLE,
                title: e.currentTarget.value,
              });
            }}
          />
          <div className="absolute right-3 text-2xs font-bold text-zinc-500">
            {state.title.length}/{maxTitleLength}
          </div>
        </div>

        {createElement(componentMap[state.postType])}

        <div className="mt-2 flex items-center gap-2 font-bold text-zinc-400">
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-full border border-zinc-500 px-3.5 py-1 capitalize tracking-wide",
              { "border-zinc-950 bg-zinc-950 text-zinc-300": state.spoiler },
            )}
            onClick={() => {
              dispatch({ type: ReducerAction.TOGGLE_SPOILER });
            }}
          >
            {state.spoiler && <CheckIcon className="h-6 w-6" />}
            {!state.spoiler && <PlusIcon className="h-6 w-6" />}
            spoiler
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-full border border-zinc-500 px-3.5 py-1 uppercase tracking-wide",
              { "border-rose-500 bg-rose-500 text-zinc-900": state.nsfw },
            )}
            onClick={() => {
              dispatch({ type: ReducerAction.TOGGLE_NSFW });
            }}
          >
            {state.nsfw && <CheckIcon className="h-6 w-6" />}
            {!state.nsfw && <PlusIcon className="h-6 w-6" />}
            nsfw
          </button>
        </div>
      </div>
    </div>
  );
}
