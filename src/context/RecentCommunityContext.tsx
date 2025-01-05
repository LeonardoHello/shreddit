"use client";

import { createContext, useContext, useEffect, useReducer } from "react";

import { z } from "zod";

import { Community } from "@/db/schema";

const MAX_RECENT_COMMUNITIES = 4;
const KEY = "recent-communities";
const CommunitySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    imageUrl: z.string().nullable(),
  })
  .array();

type RecentCommunity = Pick<Community, "id" | "name" | "imageUrl">;
type ReducerState = RecentCommunity[];

export enum ReducerAction {
  INITIALIZE,
  ADD_COMMUNITY,
  REMOVE_COMMUNITY,
}

type ReducerActionType =
  | {
      type: typeof ReducerAction.INITIALIZE;
      communities: ReducerState;
    }
  | {
      type: typeof ReducerAction.ADD_COMMUNITY;
      community: RecentCommunity;
    }
  | {
      type: typeof ReducerAction.REMOVE_COMMUNITY;
      communityId: RecentCommunity["id"];
    };

function reducer(state: ReducerState, action: ReducerActionType): ReducerState {
  switch (action.type) {
    case ReducerAction.INITIALIZE:
      return action.communities.slice(0, MAX_RECENT_COMMUNITIES);

    case ReducerAction.ADD_COMMUNITY:
      return [
        action.community,
        ...state.filter((community) => community.id !== action.community.id),
      ].slice(0, MAX_RECENT_COMMUNITIES);

    case ReducerAction.REMOVE_COMMUNITY:
      return state.filter((community) => community.id !== action.communityId);

    default:
      throw Error("Unknown action");
  }
}

const RecentCommunityContext = createContext<ReducerState | null>(null);

const RecentCommunityDispatchContext =
  createContext<React.Dispatch<ReducerActionType> | null>(null);

export default function RecentCommunityContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);
      const validated = CommunitySchema.parse(parsed);
      dispatch({ type: ReducerAction.INITIALIZE, communities: validated });
    } catch (error) {
      console.error("Failed to parse recent communities:", error);
    }
  }, []); // Run once on mount

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  return (
    <RecentCommunityContext value={state}>
      <RecentCommunityDispatchContext value={dispatch}>
        {children}
      </RecentCommunityDispatchContext>
    </RecentCommunityContext>
  );
}

export function useRecentCommunityContext() {
  const context = useContext(RecentCommunityContext);

  if (!context) {
    throw new Error("useRecentCommunityContext is used outside it's provider");
  }

  return context;
}

export function useRecentCommunityDispatchContext() {
  const context = useContext(RecentCommunityDispatchContext);

  if (!context) {
    throw new Error(
      "useRecentCommunityDispatchContext is used outside it's provider",
    );
  }

  return context;
}
