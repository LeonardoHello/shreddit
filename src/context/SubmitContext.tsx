"use client";

import { createContext, useContext, useReducer } from "react";

import type { File, Post } from "@/db/schema";

type ReducerState = Pick<Post, "title" | "text" | "spoiler" | "nsfw"> & {
  files: Omit<File, "id" | "postId">[];
  search: string;
  isDisabled: boolean;
};

export enum REDUCER_ACTION_TYPE {
  SEARCHED_COMMUNITY,
  CHANGED_TITLE,
  CHANGED_TEXT,
  CHANGED_FILES,
  TOGGLED_SPOILER,
  TOGGLED_NSFW,
  DISABLED_UPLOAD,
  ENABLED_UPLOAD,
}

type ReducerAction =
  | { type: typeof REDUCER_ACTION_TYPE.SEARCHED_COMMUNITY; nextSearch: string }
  | {
      type: typeof REDUCER_ACTION_TYPE.CHANGED_TITLE;
      nextTitle: ReducerState["title"];
    }
  | {
      type: typeof REDUCER_ACTION_TYPE.CHANGED_TEXT;
      nextText: ReducerState["text"];
    }
  | {
      type: typeof REDUCER_ACTION_TYPE.CHANGED_FILES;
      nextFiles: ReducerState["files"];
    }
  | { type: typeof REDUCER_ACTION_TYPE.TOGGLED_SPOILER }
  | { type: typeof REDUCER_ACTION_TYPE.TOGGLED_NSFW }
  | { type: typeof REDUCER_ACTION_TYPE.DISABLED_UPLOAD }
  | { type: typeof REDUCER_ACTION_TYPE.ENABLED_UPLOAD };

function reducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.CHANGED_TITLE:
      return { ...state, title: action.nextTitle };

    case REDUCER_ACTION_TYPE.CHANGED_TEXT:
      return { ...state, text: action.nextText };

    case REDUCER_ACTION_TYPE.CHANGED_FILES:
      return { ...state, files: action.nextFiles };

    case REDUCER_ACTION_TYPE.TOGGLED_SPOILER:
      return { ...state, spoiler: !state.spoiler };

    case REDUCER_ACTION_TYPE.TOGGLED_NSFW:
      return { ...state, nsfw: !state.nsfw };

    case REDUCER_ACTION_TYPE.SEARCHED_COMMUNITY:
      return { ...state, search: action.nextSearch };

    case REDUCER_ACTION_TYPE.DISABLED_UPLOAD:
      return { ...state, isDisabled: true };

    case REDUCER_ACTION_TYPE.ENABLED_UPLOAD:
      return { ...state, isDisabled: false };

    default:
      throw Error("Unknown action");
  }
}

const SubmitContext = createContext<ReducerState | null>(null);

const SubmitDispatchContext =
  createContext<React.Dispatch<ReducerAction> | null>(null);

export default function SubmitContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    title: "",
    text: null,
    nsfw: false,
    spoiler: false,
    files: [],
    search: "",
    isDisabled: false,
  });

  return (
    <SubmitContext value={state}>
      <SubmitDispatchContext value={dispatch}>{children}</SubmitDispatchContext>
    </SubmitContext>
  );
}

export function useSubmitContext() {
  const context = useContext(SubmitContext);

  if (!context) {
    throw new Error("useSubmitContext is used outside it's provider");
  }

  return context;
}

export function useSubmitDispatchContext() {
  const context = useContext(SubmitDispatchContext);

  if (!context) {
    throw new Error("useSubmitDispatchContext is used outside it's provider");
  }

  return context;
}
