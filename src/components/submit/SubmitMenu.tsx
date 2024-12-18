"use client";

import { DocumentTextIcon, PhotoIcon } from "@heroicons/react/24/outline";
import {
  DocumentTextIcon as DocumentTextIconSolid,
  PhotoIcon as PhotoIconSolid,
} from "@heroicons/react/24/solid";

import { REDUCER_ACTION_TYPE, useSubmitContext } from "@/context/SubmitContext";
import cn from "@/utils/cn";

export default function SubmitMenu() {
  const { state, dispatch } = useSubmitContext();

  const disabled = state.isMutating || state.isUploading;
  return (
    <div className="flex font-bold">
      <button
        disabled={disabled}
        className={cn(
          "flex basis-1/2 items-center justify-center gap-1.5 border-b border-b-zinc-700/70 py-3 capitalize text-zinc-500 hover:bg-zinc-700/30",
          {
            "border-b-2 border-b-zinc-300 bg-zinc-700/30 text-zinc-300":
              !state.isMediaSubmit,
            "cursor-not-allowed hover:bg-inherit": disabled,
          },
        )}
        onClick={() => {
          if (state.isMediaSubmit && !disabled) {
            // post state cleanup
            dispatch({
              type: REDUCER_ACTION_TYPE.CHANGED_FILES,
              nextFiles: [],
            });

            dispatch({
              type: REDUCER_ACTION_TYPE.TOGGLED_MEDIA_SUBMIT,
            });
          }
        }}
      >
        {state.isMediaSubmit && <DocumentTextIcon className="h-6 w-6" />}
        {!state.isMediaSubmit && <DocumentTextIconSolid className="h-6 w-6" />}
        post
      </button>

      <button
        disabled={disabled}
        className={cn(
          "flex basis-1/2 items-center justify-center gap-1.5 border-b border-l border-b-zinc-700/70 border-l-zinc-700/70 py-3 capitalize text-zinc-500 hover:bg-zinc-700/30",
          {
            "border-b-2 border-b-zinc-300 bg-zinc-700/30 text-zinc-300":
              state.isMediaSubmit,
            "cursor-not-allowed hover:bg-inherit": disabled,
          },
        )}
        onClick={() => {
          if (!state.isMediaSubmit && !disabled) {
            // post state cleanup
            dispatch({
              type: REDUCER_ACTION_TYPE.CHANGED_TEXT,
              nextText: null,
            });
            dispatch({
              type: REDUCER_ACTION_TYPE.CHANGED_FILES,
              nextFiles: [],
            });
            dispatch({
              type: REDUCER_ACTION_TYPE.TOGGLED_MEDIA_SUBMIT,
            });
          }
        }}
      >
        {state.isMediaSubmit && <PhotoIconSolid className="h-6 w-6" />}
        {!state.isMediaSubmit && <PhotoIcon className="h-6 w-6" />}
        images
      </button>
    </div>
  );
}
