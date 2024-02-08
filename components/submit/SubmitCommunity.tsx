"use client";

import Image from "next/image";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { useSubmitContext } from "@/lib/context/SubmitContextProvider";
import useDropdown from "@/lib/hooks/useDropdown";
import cn from "@/lib/utils/cn";
import communityImage from "@/public/community-logo.svg";

export default function SubmitCommunity({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dropdownRef, isOpen, setIsOpen } = useDropdown();

  const { state } = useSubmitContext();

  return (
    <div
      ref={dropdownRef}
      className="relative flex w-72 flex-col rounded bg-inherit bg-zinc-900"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      {state.community && (
        <button
          className={cn(
            "flex basis-full select-none items-center gap-2 rounded border border-zinc-700/70 p-2",
            {
              "rounded-b-none": isOpen,
            },
          )}
        >
          {state.community.imageUrl ? (
            <Image
              src={state.community.imageUrl}
              alt="community icon"
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <Image
              src={communityImage}
              alt="community icon"
              width={24}
              height={24}
              className="rounded-full border border-zinc-300 bg-zinc-300"
            />
          )}
          <h1 className="truncate text-center text-sm font-medium">
            r/{state.community.name}
          </h1>

          <ChevronDownIcon className="ml-auto h-4 w-4 min-w-[1rem] stroke-2 text-zinc-500" />
        </button>
      )}

      {!state.community && (
        <button
          className={cn(
            "flex basis-full select-none items-center gap-2 rounded border border-zinc-700/70 p-2",
            {
              "rounded-b-none": isOpen,
            },
          )}
        >
          <div className="aspect-square h-6 rounded-full border border-dashed border-zinc-500" />
          <h1 className="truncate text-center text-sm font-medium">
            Choose a community
          </h1>

          <ChevronDownIcon className="ml-auto h-4 w-4 min-w-[1rem] stroke-2 text-zinc-500" />
        </button>
      )}

      {isOpen && children}
    </div>
  );
}
