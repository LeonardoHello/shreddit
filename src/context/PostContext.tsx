"use client";

import { createContext, useContext, useReducer } from "react";

import { RouterOutput } from "@/trpc/routers/_app";
import { calculateVotes } from "@/utils/calculateVotes";

type Post = NonNullable<RouterOutput["post"]["getPost"]>;

type ReducerState = Post & {
  isEditing: boolean;
  isDisabled: boolean;
  isDeleted: boolean;
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
  TOGGLE_EDIT,
  CANCEL_EDIT,
  ENABLE_EDIT,
  DISABLE_EDIT,
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
      save: ReducerState["isSaved"];
    }
  | {
      type: typeof ReducerAction.SET_HIDE;
      hide: ReducerState["isHidden"];
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
  | { type: typeof ReducerAction.TOGGLE_EDIT }
  | { type: typeof ReducerAction.CANCEL_EDIT }
  | { type: typeof ReducerAction.ENABLE_EDIT }
  | { type: typeof ReducerAction.DISABLE_EDIT };

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
        voteCount: calculateVotes({
          voteCount: state.voteCount,
          voteStatus: state.voteStatus ?? "none",
          newVoteStatus: action.vote ?? "none",
        }),
      };

    case ReducerAction.SET_SAVE:
      return { ...state, isSaved: action.save };

    case ReducerAction.SET_HIDE:
      return { ...state, isHidden: action.hide };

    case ReducerAction.SET_SPOILER:
      return { ...state, spoiler: action.spoiler };

    case ReducerAction.SET_NSFW:
      return { ...state, nsfw: action.nsfw };

    case ReducerAction.DELETE:
      return { ...state, isDeleted: true };

    case ReducerAction.TOGGLE_EDIT:
      return { ...state, isEditing: !state.isEditing };

    case ReducerAction.CANCEL_EDIT:
      return { ...state, isEditing: false };

    case ReducerAction.ENABLE_EDIT:
      return { ...state, isDisabled: false };

    case ReducerAction.DISABLE_EDIT:
      return { ...state, isDisabled: true };

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
    isDisabled: false,
    isDeleted: false,
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
