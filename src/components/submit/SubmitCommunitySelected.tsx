"use client";

import { use } from "react";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { getSelectedCommunity } from "@/api/getCommunity";
import { useDropdownContext } from "@/context/DropdownContext";
import CommunityImage from "../community/CommunityImage";

export default function SubmitCommunitySelected({
  children,
  selectedCommunityPromise,
}: {
  children: React.ReactNode;
  selectedCommunityPromise: ReturnType<typeof getSelectedCommunity.execute>;
}) {
  const { isOpen, setIsOpen } = useDropdownContext();

  if (isOpen) {
    return children;
  }

  const selectedCommunity = use(selectedCommunityPromise);

  if (!selectedCommunity) throw new Error("Community doesn't exist");

  return (
    <div className="relative flex w-72 flex-col rounded bg-inherit bg-zinc-900">
      <button
        className="flex basis-full select-none items-center gap-2 rounded border border-zinc-700/70 p-2"
        onClick={() => setIsOpen(true)}
      >
        <CommunityImage icon={selectedCommunity.icon} size={24} />

        <h1 className="grow truncate text-start text-sm font-medium">
          r/{selectedCommunity.name}
        </h1>

        <ChevronDownIcon
          className="ml-auto h-4 w-4 min-w-[1rem] stroke-2 text-zinc-500"
          onClick={(e) => {
            e.stopPropagation();

            setIsOpen(!isOpen);
          }}
        />
      </button>
    </div>
  );
}
