"use client";

import { createContext, useContext, useReducer } from "react";

import type { Post } from "@/db/schema/posts";
import { PostType } from "@/types/enums";

export type ReducerState = Pick<Post, "title" | "text" | "spoiler" | "nsfw"> & {
  postType: PostType;
  selectedFiles: { file: File; url: string }[];
  isLoading: boolean;
  // isUploading is used for RTEPost to show the upload progress
  isUploading: boolean;
};

export enum ReducerAction {
  SET_POST_TYPE,
  SET_TITLE,
  SET_TEXT,
  SET_FILES,
  ADD_FILES,
  REMOVE_FILE,
  TOGGLE_SPOILER,
  TOGGLE_NSFW,
  START_LOADING,
  STOP_LOADING,
  START_UPLOAD,
  STOP_UPLOAD,
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
      selectedFiles: ReducerState["selectedFiles"];
    }
  | {
      type: typeof ReducerAction.ADD_FILES;
      selectedFiles: ReducerState["selectedFiles"];
    }
  | {
      type: typeof ReducerAction.REMOVE_FILE;
      fileUrl: ReducerState["selectedFiles"][number]["url"];
    }
  | { type: typeof ReducerAction.TOGGLE_SPOILER }
  | { type: typeof ReducerAction.TOGGLE_NSFW }
  | { type: typeof ReducerAction.START_LOADING }
  | { type: typeof ReducerAction.STOP_LOADING }
  | { type: typeof ReducerAction.START_UPLOAD }
  | { type: typeof ReducerAction.STOP_UPLOAD };

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
      return {
        ...state,
        selectedFiles: action.selectedFiles,
      };

    case ReducerAction.ADD_FILES:
      return {
        ...state,
        selectedFiles: state.selectedFiles.concat(action.selectedFiles),
      };

    case ReducerAction.REMOVE_FILE:
      return {
        ...state,
        selectedFiles: state.selectedFiles.filter(
          (file) => file.url !== action.fileUrl,
        ),
      };

    case ReducerAction.TOGGLE_SPOILER:
      return { ...state, spoiler: !state.spoiler };

    case ReducerAction.TOGGLE_NSFW:
      return { ...state, nsfw: !state.nsfw };

    case ReducerAction.START_LOADING:
      return { ...state, isLoading: true };

    case ReducerAction.STOP_LOADING:
      return { ...state, isLoading: false };

    case ReducerAction.START_UPLOAD:
      return { ...state, isUploading: true };

    case ReducerAction.STOP_UPLOAD:
      return { ...state, isUploading: false };

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
    selectedFiles: [],
    nsfw: false,
    spoiler: false,
    isLoading: false,
    isUploading: false,
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
