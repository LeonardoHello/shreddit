"use client";

import { createContext, useContext, useReducer } from "react";

import type { Post, PostFile } from "@/db/schema/posts";
import { PostType } from "@/types/enums";

type ReducerState = Pick<Post, "title" | "text" | "spoiler" | "nsfw"> & {
  postType: PostType;
  files: Pick<PostFile, "key" | "url" | "name" | "thumbHash">[];
  isDisabled: boolean;
};

export enum ReducerAction {
  SET_POST_TYPE,
  SET_TITLE,
  SET_TEXT,
  SET_FILES,
  TOGGLE_SPOILER,
  TOGGLE_NSFW,
  DISABLE_SUBMIT,
  ENABLE_SUBMIT,
}

type ReducerActionType =
  | { type: typeof ReducerAction.SET_POST_TYPE; postType: PostType }
  | {
      type: typeof ReducerAction.SET_TITLE;
      title: ReducerState["title"];
    }
  | {
      type: typeof ReducerAction.SET_TEXT;
      text: ReducerState["text"];
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
    case ReducerAction.SET_POST_TYPE:
      return { ...state, postType: action.postType };

    case ReducerAction.SET_TITLE:
      return { ...state, title: action.title };

    case ReducerAction.SET_TEXT:
      return { ...state, text: action.text };

    case ReducerAction.SET_FILES:
      return { ...state, files: action.nextFiles };

    case ReducerAction.TOGGLE_SPOILER:
      return { ...state, spoiler: !state.spoiler };

    case ReducerAction.TOGGLE_NSFW:
      return { ...state, nsfw: !state.nsfw };

    case ReducerAction.DISABLE_SUBMIT:
      return { ...state, isDisabled: true };

    case ReducerAction.ENABLE_SUBMIT:
      return { ...state, isDisabled: false };

    default:
      throw Error("Unknown action");
  }
};

const SubmitContext = createContext<ReducerState | null>(null);

const SubmitDispatchContext =
  createContext<React.Dispatch<ReducerActionType> | null>(null);

export default function SubmitContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    postType: PostType.TEXT,
    title: "",
    text: null,
    files: [],
    nsfw: false,
    spoiler: false,
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
