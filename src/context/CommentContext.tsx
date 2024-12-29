"use client";

import { createContext, useContext, useReducer } from "react";

import { getComments } from "@/api/getComment";
import { User, UserToComments } from "@/db/schema";
import { ArrElement } from "@/types";
import { calculateVotes } from "@/utils/calculateVotes";

type Comment = ArrElement<Awaited<ReturnType<typeof getComments.execute>>>;

type ReducerState = Comment & {
  voted: UserToComments["voteStatus"];
  edit: boolean;
  reply: boolean;
};

export enum ReducerAction {
  CHANGE_TEXT,
  CHANGE_VOTE,
  TOGGLE_EDIT,
  CANCEL_EDIT,
  TOGGLE_REPLY,
  CANCEL_REPLY,
}

type ReducerActionType =
  | {
      type: typeof ReducerAction.CHANGE_TEXT;
      nextText: ReducerState["text"];
    }
  | {
      type: typeof ReducerAction.CHANGE_VOTE;
      nextVote: ReducerState["voted"];
    }
  | { type: typeof ReducerAction.TOGGLE_EDIT }
  | { type: typeof ReducerAction.CANCEL_EDIT }
  | { type: typeof ReducerAction.TOGGLE_REPLY }
  | { type: typeof ReducerAction.CANCEL_REPLY };

function reducer(state: ReducerState, action: ReducerActionType): ReducerState {
  switch (action.type) {
    case ReducerAction.CHANGE_TEXT:
      return { ...state, text: action.nextText };

    case ReducerAction.CHANGE_VOTE:
      return {
        ...state,
        voted: action.nextVote,
        voteCount: calculateVotes({
          voteCount: state.voteCount,
          voteStatus: state.voted,
          newVoteStatus: action.nextVote,
        }),
      };

    case ReducerAction.TOGGLE_EDIT:
      return { ...state, edit: !state.edit };

    case ReducerAction.CANCEL_EDIT:
      return { ...state, edit: false };

    case ReducerAction.TOGGLE_REPLY:
      return { ...state, reply: !state.reply };

    case ReducerAction.CANCEL_REPLY:
      return { ...state, reply: false };

    default:
      throw Error("Unknown action");
  }
}

const CommentContext = createContext<ReducerState | null>(null);

const CommentDispatchContext =
  createContext<React.Dispatch<ReducerActionType> | null>(null);

export default function CommentContextProvider({
  children,
  currentUserId,
  comment,
}: {
  children: React.ReactNode;
  currentUserId: User["id"] | null;
  comment: Comment;
}) {
  const userToComment =
    currentUserId &&
    comment.usersToComments.find(
      (userToPost) => userToPost.userId === currentUserId,
    );

  const [state, dispatch] = useReducer(reducer, {
    ...comment,
    voted: userToComment ? userToComment.voteStatus : "none",
    edit: false,
    reply: false,
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
