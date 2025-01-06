"use client";

import { createContext, useContext, useEffect, useReducer } from "react";

import { z } from "zod";

import { Community } from "@/db/schema";

const MAX_RECENT_COMMUNITIES = 5;
const KEY = "recent-communities";
const CommunitySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    imageUrl: z.string().nullable(),
  })
  .array();

type RecentCommunity = Pick<Community, "id" | "name" | "imageUrl">;
type ReducerState = {
  communities: RecentCommunity[];
  isLoading: boolean;
};

export enum ReducerAction {
  INITIALIZE,
  INITIALIZE_EMPTY,
  ADD_COMMUNITY,
  REMOVE_COMMUNITY,
}

type ReducerActionType =
  | {
      type: typeof ReducerAction.INITIALIZE;
      communities: ReducerState["communities"];
    }
  | {
      type: typeof ReducerAction.INITIALIZE_EMPTY;
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
      return {
        communities: action.communities.slice(0, MAX_RECENT_COMMUNITIES),
        isLoading: false,
      };

    case ReducerAction.INITIALIZE_EMPTY:
      return {
        communities: [],
        isLoading: false,
      };

    case ReducerAction.ADD_COMMUNITY:
      return {
        ...state,
        communities: [
          action.community,
          ...state.communities.filter(
            (community) => community.id !== action.community.id,
          ),
        ].slice(0, MAX_RECENT_COMMUNITIES),
      };

    case ReducerAction.REMOVE_COMMUNITY:
      return {
        ...state,
        communities: state.communities.filter(
          (community) => community.id !== action.communityId,
        ),
      };

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
  const [state, dispatch] = useReducer(reducer, {
    communities: [],
    isLoading: true,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);

      if (!saved) {
        dispatch({ type: ReducerAction.INITIALIZE_EMPTY });
        return;
      }

      const parsed = JSON.parse(saved);
      const validated = CommunitySchema.safeParse(parsed);

      if (!validated.success) {
        dispatch({ type: ReducerAction.INITIALIZE_EMPTY });
        return;
      }

      dispatch({
        type: ReducerAction.INITIALIZE,
        communities: validated.data,
      });
    } catch (error) {
      console.error("Failed to get recent communities:", error);
      dispatch({ type: ReducerAction.INITIALIZE_EMPTY });
    }
  }, []); // Run once on mount

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state.communities));
    } catch (error) {
      console.error("Failed to save recent communities:", error);
    }
  }, [state.communities]);

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
