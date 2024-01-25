"use client";

import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

import type { getMinCommunityByName } from "../api/getCommunity";

type SelectedCommunity = Awaited<
  ReturnType<typeof getMinCommunityByName.execute>
>;

const SubmitContext = createContext<{
  selectedCommunity: SelectedCommunity;
  setSelectedCommunity: Dispatch<SetStateAction<SelectedCommunity>>;
} | null>(null);

export default function SubmitContextProvider({
  initialSelectedCommunity,
  children,
}: {
  initialSelectedCommunity: SelectedCommunity;
  children: React.ReactNode;
}) {
  const [selectedCommunity, setSelectedCommunity] = useState(
    initialSelectedCommunity,
  );

  return (
    <SubmitContext.Provider value={{ selectedCommunity, setSelectedCommunity }}>
      {children}
    </SubmitContext.Provider>
  );
}

export function useSubmitContext() {
  const context = useContext(SubmitContext);

  if (!context) {
    throw new Error("useSubmitContext is used outside it's provider");
  }

  return context;
}
