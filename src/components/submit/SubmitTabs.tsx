"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

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
  REDUCER_ACTION_TYPE,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { PostType } from "@/types";
import cn from "@/utils/cn";
import { postTypeMap } from "./Submit";

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

export default function SubmitTabs({
  children,
  postType,
}: {
  children: React.ReactNode;
  postType: PostType;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const createQueryString = useCallback((value: string) => {
    const params = new URLSearchParams();
    params.set("type", value);

    return params.toString();
  }, []);

  const maxTitleLength = 300;

  return (
    <div className="flex flex-col">
      <div className="flex gap-px rounded-t bg-zinc-800 font-bold">
        {Object.values(postTypeMap).map((type, index, arr) => (
          <button
            key={type}
            disabled={state.isDisabled}
            className={cn(
              "flex basis-1/2 items-center justify-center gap-1.5 border-b border-b-zinc-700/70 bg-zinc-900 py-3 capitalize text-zinc-500 hover:bg-zinc-700/30",
              {
                "border-b-2 border-b-zinc-300 text-zinc-300": postType === type,
                "cursor-not-allowed hover:bg-inherit": state.isDisabled,
                "rounded-tl": index === 0,
                "rounded-tr": index === arr.length - 1,
              },
            )}
            onClick={() => {
              if (postType === type || state.isDisabled) return;

              router.replace(pathname + "?" + createQueryString(type));
            }}
          >
            {postType === type
              ? icons[type]["selected"]
              : icons[type]["unselected"]}

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
                type: REDUCER_ACTION_TYPE.CHANGED_TITLE,
                nextTitle: e.currentTarget.value,
              });
            }}
          />
          <div className="absolute right-3 text-2xs font-bold text-zinc-500">
            {state.title.length}/{maxTitleLength}
          </div>
        </div>

        {children}

        <div className="mt-2 flex items-center gap-2 font-bold text-zinc-400">
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-full border border-zinc-500 px-3.5 py-1 capitalize tracking-wide",
              { "border-zinc-950 bg-zinc-950 text-zinc-300": state.spoiler },
            )}
            onClick={() => {
              dispatch({ type: REDUCER_ACTION_TYPE.TOGGLED_SPOILER });
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
              dispatch({ type: REDUCER_ACTION_TYPE.TOGGLED_NSFW });
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
