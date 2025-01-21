"use client";

import { createContext, useContext, useEffect, useReducer } from "react";

import { Community, CommunitySchema } from "@/db/schema";

type RecentCommunity = Pick<Community, "id" | "name" | "icon">;
type ReducerState = {
  communities: RecentCommunity[];
  isLoading: boolean;
};

export enum ReducerAction {
  INITIALIZE,
  ADD_COMMUNITY,
}

type ReducerActionType =
  | {
      type: typeof ReducerAction.INITIALIZE;
    }
  | {
      type: typeof ReducerAction.ADD_COMMUNITY;
      community: RecentCommunity;
    };

const key = "recent-communities";

function reducer(state: ReducerState, action: ReducerActionType): ReducerState {
  switch (action.type) {
    case ReducerAction.INITIALIZE:
      if (typeof window === "undefined") {
        return { ...state, isLoading: false };
      }

      try {
        const saved = localStorage.getItem(key);

        if (!saved) {
          return { ...state, isLoading: false };
        }

        const parsed = JSON.parse(saved);

        const validated = CommunitySchema.pick({
          id: true,
          name: true,
          icon: true,
        })
          .array()
          .safeParse(parsed);

        if (!validated.success) {
          return { ...state, isLoading: false };
        }

        return { communities: validated.data, isLoading: false };
      } catch (error) {
        console.error("Failed to get recent communities:", error);
        return { ...state, isLoading: false };
      }

    case ReducerAction.ADD_COMMUNITY:
      const filteredCommunities = state.communities.filter(
        (community) => community.id !== action.community.id,
      );

      filteredCommunities.unshift(action.community);

      const updatedState = {
        ...state,
        communities: filteredCommunities.slice(0, 5),
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(key, JSON.stringify(updatedState.communities));
        } catch (error) {
          console.error("Failed to update for recent communities:", error);
        }
      }

      return updatedState;

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
    dispatch({ type: ReducerAction.INITIALIZE });
  }, []);

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
