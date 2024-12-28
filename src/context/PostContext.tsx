"use client";

import { createContext, useContext, useReducer } from "react";

import { User } from "@clerk/nextjs/server";

import { UserToPost } from "@/db/schema";
import { RouterOutput } from "@/trpc/routers/_app";
import { calculateVotes } from "@/utils/calculateVotes";

type Post = NonNullable<RouterOutput["getPost"]>;

type ReducerState = Post & {
  voted: UserToPost["voteStatus"];
  saved: UserToPost["saved"];
  hidden: UserToPost["hidden"];
  edit: boolean;
  disabled: boolean;
  deleted: boolean;
};

export enum ReducerAction {
  CHANGE_TITLE,
  CHANGE_TEXT,
  CHANGE_VOTE,
  CHANGE_SPOILER,
  CHANGE_NSFW,
  CHANGE_HIDDEN,
  CHANGE_SAVED,
  DELETE,
  TOGGLE_EDIT,
  CANCEL_EDIT,
  ENABLE_EDIT,
  DISABLE_EDIT,
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
  | {
      type: typeof ReducerAction.CHANGE_VOTE;
      nextVote: ReducerState["voted"];
    }
  | {
      type: typeof ReducerAction.CHANGE_SAVED;
      nextSaved: ReducerState["saved"];
    }
  | {
      type: typeof ReducerAction.CHANGE_HIDDEN;
      nextHidden: ReducerState["hidden"];
    }
  | {
      type: typeof ReducerAction.CHANGE_SPOILER;
      nextSpoiler: ReducerState["spoiler"];
    }
  | {
      type: typeof ReducerAction.CHANGE_NSFW;
      nextNsfw: ReducerState["nsfw"];
    }
  | { type: typeof ReducerAction.DELETE }
  | { type: typeof ReducerAction.TOGGLE_EDIT }
  | { type: typeof ReducerAction.CANCEL_EDIT }
  | { type: typeof ReducerAction.ENABLE_EDIT }
  | { type: typeof ReducerAction.DISABLE_EDIT };

function reducer(state: ReducerState, action: ReducerActionType): ReducerState {
  switch (action.type) {
    case ReducerAction.CHANGE_TITLE:
      return { ...state, title: action.nextTitle };

    case ReducerAction.CHANGE_TEXT:
      return { ...state, text: action.nextText };

    case ReducerAction.CHANGE_VOTE:
      return {
        ...state,
        voted: action.nextVote,
        voteCount: calculateVotes({
          voteCount: state.voteCount,
          voted: state.voted,
          nextVote: action.nextVote,
        }),
      };

    case ReducerAction.CHANGE_SAVED:
      return { ...state, saved: action.nextSaved };

    case ReducerAction.CHANGE_HIDDEN:
      return { ...state, hidden: action.nextHidden };

    case ReducerAction.CHANGE_SPOILER:
      return { ...state, spoiler: action.nextSpoiler };

    case ReducerAction.CHANGE_NSFW:
      return { ...state, nsfw: action.nextNsfw };

    case ReducerAction.DELETE:
      return { ...state, deleted: true };

    case ReducerAction.TOGGLE_EDIT:
      return { ...state, edit: !state.edit };

    case ReducerAction.CANCEL_EDIT:
      return { ...state, edit: false };

    case ReducerAction.ENABLE_EDIT:
      return { ...state, disabled: false };

    case ReducerAction.DISABLE_EDIT:
      return { ...state, disabled: true };

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
  currentUserId,
}: {
  children: React.ReactNode;
  currentUserId: User["id"] | null;
  post: Post;
}) {
  const userToPost =
    currentUserId &&
    post.usersToPosts.find((userToPost) => userToPost.userId === currentUserId);

  const [state, dispatch] = useReducer(reducer, {
    ...post,
    voted: userToPost ? userToPost.voteStatus : "none",
    saved: userToPost ? userToPost.saved : false,
    hidden: userToPost ? userToPost.hidden : false,
    edit: false,
    disabled: false,
    deleted: false,
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
