"use client";

import { createContext, useContext, useReducer } from "react";

import type { File, Post } from "@/lib/db/schema";

import type { getSelectedCommunity } from "../api/getCommunity";

type ReducerState = Pick<Post, "title" | "text" | "spoiler" | "nsfw"> & {
  community: Awaited<ReturnType<typeof getSelectedCommunity.execute>>;
  files: Omit<File, "id" | "postId">[];
  isMutating: boolean;
};

export enum REDUCER_ACTION_TYPE {
  CHANGED_COMMUNITY,
  CHANGED_TITLE,
  CHANGED_TEXT,
  CHANGED_FILES,
  ADDED_FILES,
  TOGGLED_SPOILER,
  TOGGLED_NSFW,
  MUTATED,
}

type ReducerAction = {
  [K in REDUCER_ACTION_TYPE]: K extends REDUCER_ACTION_TYPE.CHANGED_TITLE
    ? { type: K; nextTitle: ReducerState["title"] }
    : K extends REDUCER_ACTION_TYPE.CHANGED_COMMUNITY
    ? { type: K; nextCommunity: ReducerState["community"] }
    : K extends REDUCER_ACTION_TYPE.CHANGED_TEXT
    ? { type: K; nextText: ReducerState["text"] }
    : K extends REDUCER_ACTION_TYPE.CHANGED_FILES
    ? { type: K; nextFiles: ReducerState["files"] }
    : K extends REDUCER_ACTION_TYPE.ADDED_FILES
    ? { type: K; nextFiles: ReducerState["files"] }
    : { type: K };
}[REDUCER_ACTION_TYPE];

function reducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.CHANGED_COMMUNITY:
      return {
        ...state,
        community: action.nextCommunity,
      };

    case REDUCER_ACTION_TYPE.CHANGED_TITLE:
      return {
        ...state,
        title: action.nextTitle,
      };

    case REDUCER_ACTION_TYPE.CHANGED_TEXT:
      return {
        ...state,
        text: action.nextText,
      };

    case REDUCER_ACTION_TYPE.TOGGLED_SPOILER:
      return {
        ...state,
        spoiler: !state.spoiler,
      };

    case REDUCER_ACTION_TYPE.TOGGLED_NSFW:
      return {
        ...state,
        nsfw: !state.nsfw,
      };

    case REDUCER_ACTION_TYPE.CHANGED_FILES:
      return {
        ...state,
        files: action.nextFiles,
      };

    case REDUCER_ACTION_TYPE.ADDED_FILES:
      return {
        ...state,
        files: state.files.concat(action.nextFiles),
      };

    case REDUCER_ACTION_TYPE.MUTATED:
      return {
        ...state,
        isMutating: true,
      };

    default:
      throw Error("Unknown action");
  }
}

const SubmitContext = createContext<{
  state: ReducerState;
  dispatch: React.Dispatch<ReducerAction>;
} | null>(null);

export default function PostSubmitContextProvider({
  initialSelectedCommunity,
  children,
}: {
  initialSelectedCommunity: ReducerState["community"];
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    community: initialSelectedCommunity,
    title: "",
    text: null,
    nsfw: false,
    spoiler: false,
    files: [],
    isMutating: false,
  });

  return (
    <SubmitContext.Provider value={{ state, dispatch }}>
      {children}
    </SubmitContext.Provider>
  );
}

export function usePostSubmitContext() {
  const context = useContext(SubmitContext);

  if (!context) {
    throw new Error("useSubmitContext is used outside it's provider");
  }

  return context;
}
