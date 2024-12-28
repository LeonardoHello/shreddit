"use client";

import { createContext, useContext, useReducer } from "react";
import { useSearchParams } from "next/navigation";

import type { File, Post } from "@/db/schema";
import { PostType } from "@/types";

type ReducerState = Pick<Post, "title" | "text" | "spoiler" | "nsfw"> & {
  files: Omit<File, "id" | "postId">[];
  communitySearch: string;
  disabled: boolean;
  type: PostType;
};

export enum ReducerAction {
  SEARCH_COMMUNITY,
  SET_TYPE,
  SET_TITLE,
  SET_TEXT,
  SET_FILES,
  TOGGLE_SPOILER,
  TOGGLE_NSFW,
  DISABLE_SUBMIT,
  ENABLE_SUBMIT,
}

type ReducerActionType =
  | { type: typeof ReducerAction.SEARCH_COMMUNITY; nextCommunitySearch: string }
  | { type: typeof ReducerAction.SET_TYPE; nextType: PostType }
  | {
      type: typeof ReducerAction.SET_TITLE;
      nextTitle: ReducerState["title"];
    }
  | {
      type: typeof ReducerAction.SET_TEXT;
      nextText: ReducerState["text"];
    }
  | {
      type: typeof ReducerAction.SET_FILES;
      nextFiles: ReducerState["files"];
    }
  | { type: typeof ReducerAction.TOGGLE_SPOILER }
  | { type: typeof ReducerAction.TOGGLE_NSFW }
  | { type: typeof ReducerAction.DISABLE_SUBMIT }
  | { type: typeof ReducerAction.ENABLE_SUBMIT };

const reducer = (
  state: ReducerState,
  action: ReducerActionType,
): ReducerState => {
  switch (action.type) {
    case ReducerAction.SEARCH_COMMUNITY:
      return { ...state, communitySearch: action.nextCommunitySearch };

    case ReducerAction.SET_TYPE:
      return { ...state, type: action.nextType };

    case ReducerAction.SET_TITLE:
      return { ...state, title: action.nextTitle };

    case ReducerAction.SET_TEXT:
      return { ...state, text: action.nextText };

    case ReducerAction.SET_FILES:
      return { ...state, files: action.nextFiles };

    case ReducerAction.TOGGLE_SPOILER:
      return { ...state, spoiler: !state.spoiler };

    case ReducerAction.TOGGLE_NSFW:
      return { ...state, nsfw: !state.nsfw };

    case ReducerAction.DISABLE_SUBMIT:
      return { ...state, disabled: true };

    case ReducerAction.ENABLE_SUBMIT:
      return { ...state, disabled: false };

    default:
      throw Error("Unknown action");
  }
};

const SubmitContext = createContext<ReducerState | null>(null);

const SubmitDispatchContext =
  createContext<React.Dispatch<ReducerActionType> | null>(null);

const defaultType = PostType.TEXT;

export default function SubmitContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  const [state, dispatch] = useReducer(reducer, {
    type:
      PostType[(searchParams.get("type") ?? defaultType) as PostType] ??
      defaultType,
    communitySearch: "",
    title: "",
    text: null,
    files: [],
    nsfw: false,
    spoiler: false,
    disabled: false,
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
