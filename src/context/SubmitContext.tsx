"use client";

import { createContext, useContext, useReducer } from "react";

import type { File, Post } from "@/db/schema";
import type { getSelectedCommunity } from "../api/getCommunity";

type ReducerState = Pick<Post, "title" | "text" | "spoiler" | "nsfw"> & {
  community: Awaited<ReturnType<typeof getSelectedCommunity.execute>>;
  files: Omit<File, "id" | "postId">[];
  search: string;
  isMutating: boolean;
  isUploading: boolean;
  isMediaSubmit: boolean;
};

export enum REDUCER_ACTION_TYPE {
  CHANGED_COMMUNITY,
  CHANGED_TITLE,
  CHANGED_TEXT,
  CHANGED_FILES,
  ADDED_FILES,
  SEARCHED_COMMUNITY,
  TOGGLED_MEDIA_SUBMIT,
  TOGGLED_SPOILER,
  TOGGLED_NSFW,
  STARTED_UPLOAD,
  STOPPED_UPLOAD,
  STARTED_MUTATE,
}

type ReducerAction =
  | {
      type: typeof REDUCER_ACTION_TYPE.CHANGED_COMMUNITY;
      nextCommunity: ReducerState["community"];
    }
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
  | {
      type: typeof REDUCER_ACTION_TYPE.ADDED_FILES;
      nextFiles: ReducerState["files"];
    }
  | { type: typeof REDUCER_ACTION_TYPE.SEARCHED_COMMUNITY; nextSearch: string }
  | { type: typeof REDUCER_ACTION_TYPE.TOGGLED_MEDIA_SUBMIT }
  | { type: typeof REDUCER_ACTION_TYPE.TOGGLED_SPOILER }
  | { type: typeof REDUCER_ACTION_TYPE.TOGGLED_NSFW }
  | { type: typeof REDUCER_ACTION_TYPE.STARTED_UPLOAD }
  | { type: typeof REDUCER_ACTION_TYPE.STOPPED_UPLOAD }
  | { type: typeof REDUCER_ACTION_TYPE.STARTED_MUTATE };

function reducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.CHANGED_COMMUNITY:
      return { ...state, community: action.nextCommunity };

    case REDUCER_ACTION_TYPE.CHANGED_TITLE:
      return { ...state, title: action.nextTitle };

    case REDUCER_ACTION_TYPE.CHANGED_TEXT:
      return { ...state, text: action.nextText };

    case REDUCER_ACTION_TYPE.CHANGED_FILES:
      return { ...state, files: action.nextFiles };

    case REDUCER_ACTION_TYPE.ADDED_FILES:
      return { ...state, files: state.files.concat(action.nextFiles) };

    case REDUCER_ACTION_TYPE.TOGGLED_MEDIA_SUBMIT:
      return { ...state, isMediaSubmit: !state.isMediaSubmit };

    case REDUCER_ACTION_TYPE.TOGGLED_SPOILER:
      return { ...state, spoiler: !state.spoiler };

    case REDUCER_ACTION_TYPE.TOGGLED_NSFW:
      return { ...state, nsfw: !state.nsfw };

    case REDUCER_ACTION_TYPE.SEARCHED_COMMUNITY:
      return { ...state, search: action.nextSearch };

    case REDUCER_ACTION_TYPE.STARTED_UPLOAD:
      return { ...state, isUploading: true };

    case REDUCER_ACTION_TYPE.STOPPED_UPLOAD:
      return { ...state, isUploading: false };

    case REDUCER_ACTION_TYPE.STARTED_MUTATE:
      return { ...state, isMutating: true };

    default:
      throw Error("Unknown action");
  }
}

const SubmitContext = createContext<ReducerState | null>(null);

const SubmitDispatchContext =
  createContext<React.Dispatch<ReducerAction> | null>(null);

export default function SubmitContextProvider({
  initialSelectedCommunity,
  initialSubmit,
  children,
}: {
  initialSelectedCommunity: ReducerState["community"];
  initialSubmit: string | string[] | undefined;
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    community: initialSelectedCommunity,
    title: "",
    text: null,
    nsfw: false,
    spoiler: false,
    files: [],
    search: "",
    isMutating: false,
    isUploading: false,
    isMediaSubmit: initialSubmit === "media",
  });

  return (
    <SubmitContext value={state}>
      <SubmitDispatchContext value={dispatch}>{children}</SubmitDispatchContext>
    </SubmitContext>
  );
}

export function useSubmit() {
  const context = useContext(SubmitContext);

  if (!context) {
    throw new Error("useSubmitContext is used outside it's provider");
  }

  return context;
}

export function useSubmitDispatch() {
  const context = useContext(SubmitDispatchContext);

  if (!context) {
    throw new Error("SubmitDispatchContext is used outside it's provider");
  }

  return context;
}
