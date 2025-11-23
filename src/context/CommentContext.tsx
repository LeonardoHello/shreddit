"use client";

import { createContext, useContext, useReducer } from "react";

import type { InferResponseType } from "hono/client";

import type { client } from "@/hono/client";
import { ArrElement } from "@/types/helpers";
import { calculateVotes } from "@/utils/calculateVotes";

type Comment = ArrElement<
  InferResponseType<
    (typeof client.posts)[":postId{[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}}"]["comments"]["$get"],
    200
  >
>;

type ReducerState = Comment & {
  isEditing: boolean;
  isReplying: boolean;
};

export enum ReducerAction {
  SET_TEXT,
  SET_VOTE,
  TOGGLE_EDIT,
  CANCEL_EDIT,
  TOGGLE_REPLY,
  CANCEL_REPLY,
}

type ReducerActionType =
  | {
      type: typeof ReducerAction.SET_TEXT;
      text: ReducerState["text"];
    }
  | {
      type: typeof ReducerAction.SET_VOTE;
      vote: ReducerState["voteStatus"];
    }
  | { type: typeof ReducerAction.TOGGLE_EDIT }
  | { type: typeof ReducerAction.CANCEL_EDIT }
  | { type: typeof ReducerAction.TOGGLE_REPLY }
  | { type: typeof ReducerAction.CANCEL_REPLY };

function reducer(state: ReducerState, action: ReducerActionType): ReducerState {
  switch (action.type) {
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

    case ReducerAction.TOGGLE_EDIT:
      return { ...state, isEditing: !state.isEditing };

    case ReducerAction.CANCEL_EDIT:
      return { ...state, isEditing: false };

    case ReducerAction.TOGGLE_REPLY:
      return { ...state, isReplying: !state.isReplying };

    case ReducerAction.CANCEL_REPLY:
      return { ...state, isReplying: false };

    default:
      throw Error("Unknown action");
  }
}

const CommentContext = createContext<ReducerState | null>(null);

const CommentDispatchContext =
  createContext<React.Dispatch<ReducerActionType> | null>(null);

export default function CommentContextProvider({
  children,
  comment,
}: {
  children: React.ReactNode;
  comment: Comment;
}) {
  const [state, dispatch] = useReducer(reducer, {
    ...comment,
    isEditing: false,
    isReplying: false,
  });

  return (
    <CommentContext value={state}>
      <CommentDispatchContext value={dispatch}>
        {children}
      </CommentDispatchContext>
    </CommentContext>
  );
}

export function useCommentContext() {
  const context = useContext(CommentContext);

  if (!context) {
    throw new Error("useCommentContext is used outside it's provider");
  }

  return context;
}

export function useCommentDispatchContext() {
  const context = useContext(CommentDispatchContext);

  if (!context) {
    throw new Error("useCommentDispatchContext is used outside it's provider");
  }

  return context;
}
