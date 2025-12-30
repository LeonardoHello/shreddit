"use client";

import { createContext, useContext, useReducer } from "react";

import type { InferResponseType } from "hono";

import type { client } from "@/hono/client";
import { voteStatusDelta } from "@/utils/voteStatusDelta";

type Post = NonNullable<
  InferResponseType<
    (typeof client.posts)[":postId{[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}}"]["$get"],
    200
  >
>;

type ReducerState = Post & {
  isEditing: boolean;
  isDeleted: boolean;
  isUploading: boolean;
};

export enum ReducerAction {
  SET_TITLE,
  SET_TEXT,
  SET_VOTE,
  SET_SPOILER,
  SET_NSFW,
  SET_HIDE,
  SET_SAVE,
  DELETE,
  RESTORE,
  TOGGLE_EDIT,
  CANCEL_EDIT,
  START_UPLOAD,
  STOP_UPLOAD,
}

type ReducerActionType =
  | {
      type: typeof ReducerAction.SET_TITLE;
      title: ReducerState["title"];
    }
  | {
      type: typeof ReducerAction.SET_TEXT;
      text: ReducerState["text"];
    }
  | {
      type: typeof ReducerAction.SET_VOTE;
      vote: ReducerState["voteStatus"];
    }
  | {
      type: typeof ReducerAction.SET_SAVE;
      save: ReducerState["saved"];
    }
  | {
      type: typeof ReducerAction.SET_HIDE;
      hide: ReducerState["hidden"];
    }
  | {
      type: typeof ReducerAction.SET_SPOILER;
      spoiler: ReducerState["spoiler"];
    }
  | {
      type: typeof ReducerAction.SET_NSFW;
      nsfw: ReducerState["nsfw"];
    }
  | { type: typeof ReducerAction.DELETE }
  | { type: typeof ReducerAction.RESTORE }
  | { type: typeof ReducerAction.TOGGLE_EDIT }
  | { type: typeof ReducerAction.CANCEL_EDIT }
  | { type: typeof ReducerAction.START_UPLOAD }
  | { type: typeof ReducerAction.STOP_UPLOAD };

function reducer(state: ReducerState, action: ReducerActionType): ReducerState {
  switch (action.type) {
    case ReducerAction.SET_TITLE:
      return { ...state, title: action.title };

    case ReducerAction.SET_TEXT:
      return { ...state, text: action.text };

    case ReducerAction.SET_VOTE:
      return {
        ...state,
        voteStatus: action.vote,
        voteCount:
          state.voteCount +
          voteStatusDelta({
            oldStatus: state.voteStatus ?? "none",
            newStatus: action.vote ?? "none",
          }),
      };

    case ReducerAction.SET_SAVE:
      return { ...state, saved: action.save };

    case ReducerAction.SET_HIDE:
      return { ...state, hidden: action.hide };

    case ReducerAction.SET_SPOILER:
      return { ...state, spoiler: action.spoiler };

    case ReducerAction.SET_NSFW:
      return { ...state, nsfw: action.nsfw };

    case ReducerAction.DELETE:
      return { ...state, isDeleted: true };

    case ReducerAction.RESTORE:
      return { ...state, isDeleted: false };

    case ReducerAction.TOGGLE_EDIT:
      return { ...state, isEditing: !state.isEditing };

    case ReducerAction.CANCEL_EDIT:
      return { ...state, isEditing: false };

    case ReducerAction.START_UPLOAD:
      return { ...state, isUploading: true };

    case ReducerAction.STOP_UPLOAD:
      return { ...state, isUploading: false };

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
    isEditing: false,
    isDeleted: false,
    isUploading: false,
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
