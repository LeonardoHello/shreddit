"use client";

import React from "react";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { useDropdownContext } from "@/context/DropdownContext";

export default function SubmitCommunity({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, setIsOpen } = useDropdownContext();

  if (isOpen) {
    return children;
  }

  return (
    <div className="relative flex w-72 flex-col rounded bg-zinc-900">
      <button
        className="flex basis-full select-none items-center gap-2 rounded border border-zinc-700/70 p-2"
        onClick={() => setIsOpen(true)}
      >
        <div className="aspect-square h-6 rounded-full border border-dashed border-zinc-500" />
        <h1 className="grow truncate text-start text-sm font-medium">
          Choose a community
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
