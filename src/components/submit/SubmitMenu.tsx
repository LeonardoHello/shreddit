"use client";

import { DocumentTextIcon, PhotoIcon } from "@heroicons/react/24/outline";
import {
  DocumentTextIcon as DocumentTextIconSolid,
  PhotoIcon as PhotoIconSolid,
} from "@heroicons/react/24/solid";

import {
  REDUCER_ACTION_TYPE,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { SubmitType } from "@/types";
import cn from "@/utils/cn";

export default function SubmitMenu() {
  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const disabled = state.isMutating || state.isUploading;

  return (
    <div className="flex font-bold">
      <button
        disabled={disabled}
        className={cn(
          "flex basis-1/2 items-center justify-center gap-1.5 border-b border-b-zinc-700/70 py-3 capitalize text-zinc-500 hover:bg-zinc-700/30",
          {
            "border-b-2 border-b-zinc-300 bg-zinc-700/30 text-zinc-300":
              state.type === SubmitType.TEXT,
            "cursor-not-allowed hover:bg-inherit": disabled,
          },
        )}
        onClick={() => {
          if (state.type !== SubmitType.TEXT && !disabled) {
            // post state cleanup
            dispatch({
              type: REDUCER_ACTION_TYPE.CHANGED_TYPE,
              nextType: SubmitType.TEXT,
            });
          }
        }}
      >
        {state.type === SubmitType.TEXT && (
          <DocumentTextIconSolid className="h-6 w-6" />
        )}
        {state.type !== SubmitType.TEXT && (
          <DocumentTextIcon className="h-6 w-6" />
        )}
        post
      </button>

      <button
        disabled={disabled}
        className={cn(
          "flex basis-1/2 items-center justify-center gap-1.5 border-b border-l border-b-zinc-700/70 border-l-zinc-700/70 py-3 capitalize text-zinc-500 hover:bg-zinc-700/30",
          {
            "border-b-2 border-b-zinc-300 bg-zinc-700/30 text-zinc-300":
              state.type === SubmitType.IMAGE,
            "cursor-not-allowed hover:bg-inherit": disabled,
          },
        )}
        onClick={() => {
          if (state.type !== SubmitType.IMAGE && !disabled) {
            // post state cleanup
            dispatch({
              type: REDUCER_ACTION_TYPE.CHANGED_TYPE,
              nextType: SubmitType.IMAGE,
            });
          }
        }}
      >
        {state.type === SubmitType.IMAGE && (
          <PhotoIconSolid className="h-6 w-6" />
        )}
        {state.type !== SubmitType.IMAGE && <PhotoIcon className="h-6 w-6" />}
        images
      </button>
    </div>
  );
}
