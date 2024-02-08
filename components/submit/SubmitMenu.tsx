"use client";

import { DocumentTextIcon, PhotoIcon } from "@heroicons/react/24/outline";
import {
  DocumentTextIcon as DocumentTextIconSolid,
  PhotoIcon as PhotoIconSolid,
} from "@heroicons/react/24/solid";

import {
  REDUCER_ACTION_TYPE,
  useSubmitContext,
} from "@/lib/context/SubmitContextProvider";
import cn from "@/lib/utils/cn";

export default function SubmitMenu() {
  const { state, dispatch } = useSubmitContext();

  return (
    <div className="flex font-bold">
      <button
        disabled={state.isMutating}
        className={cn(
          "flex basis-1/2 items-center justify-center gap-1.5 border-b border-b-zinc-700/70 py-3 capitalize text-zinc-500 hover:bg-zinc-700/30",
          {
            "border-b-2 border-b-zinc-300 bg-zinc-700/30 text-zinc-300":
              !state.media,
            "cursor-not-allowed hover:bg-inherit": state.isMutating,
          },
        )}
        onClick={() => {
          if (state.media) {
            dispatch({
              type: REDUCER_ACTION_TYPE.CHANGED_FILES,
              nextFiles: [],
            });

            dispatch({
              type: REDUCER_ACTION_TYPE.CANCELED_MEDIA,
            });
          }
        }}
      >
        {state.media && <DocumentTextIcon className="h-6 w-6" />}
        {!state.media && <DocumentTextIconSolid className="h-6 w-6" />}
        post
      </button>

      <button
        disabled={state.isMutating}
        className={cn(
          "flex basis-1/2 items-center justify-center gap-1.5 border-b border-l border-b-zinc-700/70 border-l-zinc-700/70 py-3 capitalize text-zinc-500 hover:bg-zinc-700/30",
          {
            "border-b-2 border-b-zinc-300 bg-zinc-700/30 text-zinc-300":
              state.media,
            "cursor-not-allowed hover:bg-inherit": state.isMutating,
          },
        )}
        onClick={() => {
          if (!state.media) {
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
              type: REDUCER_ACTION_TYPE.SET_MEDIA,
            });
          }
        }}
      >
        {state.media && <PhotoIconSolid className="h-6 w-6" />}
        {!state.media && <PhotoIcon className="h-6 w-6" />}
        images
      </button>
    </div>
  );
}