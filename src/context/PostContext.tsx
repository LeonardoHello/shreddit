"use client";

import { createContext, useContext, useReducer } from "react";

import { RouterOutput } from "@/trpc/routers/_app";

type Post = NonNullable<RouterOutput["getPost"]>;

type ReducerState = Post & { edit: boolean };

export enum ReducerAction {
  CHANGE_TITLE,
  CHANGE_TEXT,
  TOGGLE_SPOILER,
  TOGGLE_NSFW,
  TOGGLE_EDIT,
  CANCEL_EDIT,
}

type ReducerActionType =
  | {
      type: typeof ReducerAction.CHANGE_TITLE;
      nextTitle: ReducerState["title"];
    }
  | {
      type: typeof ReducerAction.CHANGE_TEXT;
      nextText: ReducerState["text"];
    }
  | { type: typeof ReducerAction.TOGGLE_SPOILER }
  | { type: typeof ReducerAction.TOGGLE_NSFW }
  | { type: typeof ReducerAction.TOGGLE_EDIT }
  | { type: typeof ReducerAction.CANCEL_EDIT };

function reducer(state: ReducerState, action: ReducerActionType): ReducerState {
  switch (action.type) {
    case ReducerAction.CHANGE_TITLE:
      return { ...state, title: action.nextTitle };

    case ReducerAction.CHANGE_TEXT:
      return { ...state, text: action.nextText };

    case ReducerAction.TOGGLE_SPOILER:
      return { ...state, spoiler: !state.spoiler };

    case ReducerAction.TOGGLE_NSFW:
      return { ...state, nsfw: !state.nsfw };

    case ReducerAction.TOGGLE_EDIT:
      return { ...state, edit: !state.edit };

    case ReducerAction.CANCEL_EDIT:
      return { ...state, edit: false };

    default:
      throw Error("Unknown action");
  }
}

const PostContext = createContext<ReducerState | null>(null);

const PostDispatchContext =
  createContext<React.Dispatch<ReducerActionType> | null>(null);

export default function PostContextProvider({
  children,
  post,
}: {
  children: React.ReactNode;
  post: Post;
}) {
  const [state, dispatch] = useReducer(reducer, {
    ...post,
    edit: false,
  });

  return (
    <PostContext value={state}>
      <PostDispatchContext value={dispatch}>{children}</PostDispatchContext>
    </PostContext>
  );
}

export function usePostContext() {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePostContext is used outside it's provider");
  }

  return context;
}

export function usePostDispatchContext() {
  const context = useContext(PostDispatchContext);

  if (!context) {
    throw new Error("usePostDispatchContext is used outside it's provider");
  }

  return context;
}
