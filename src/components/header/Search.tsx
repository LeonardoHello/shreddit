"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import useDropdown from "@/hooks/useDropdown";
import { trpc } from "@/trpc/client";
import { cn } from "@/utils/cn";

const SearchDropdown = dynamic(() => import("./SearchDropdown"));

export default function Search() {
  const pathname = usePathname();
  const [searchedValue, setSearchedValue] = useState("");

  const { dropdownRef, isOpen, setIsOpen } = useDropdown();

  useEffect(() => {
    setIsOpen(false);
    return () => {
      setIsOpen(false);
    };
  }, [pathname, setIsOpen]);

  const utils = trpc.useUtils();

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // replace every character except letters, numbers, underscores and dashes
    const searchedValue = e.currentTarget.value.replaceAll(
      /[^a-zA-Z0-9_-]/g,
      "",
    );

    await Promise.all([
      utils.community.searchCommunities.cancel(),
      utils.user.searchUsers.cancel(),
    ]);

    setSearchedValue(searchedValue);

    if (searchedValue.length === 0 && isOpen === true) {
      setIsOpen(false);
    } else if (searchedValue.length > 0 && isOpen === false) {
      setIsOpen(true);
    }
  };

  const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div
      className="static flex max-w-xl grow flex-col bg-inherit sm:relative"
      ref={dropdownRef}
    >
      <div className="relative flex basis-full sm:static">
        <label
          htmlFor="search"
          className="absolute left-4 self-center"
          onClick={(e) => {
            if (searchedValue.length === 0) return;

            if (isOpen) {
              e.preventDefault();
              setIsOpen(false);
            }
          }}
        >
          <MagnifyingGlassIcon className="h-6 w-6 text-zinc-500" />
        </label>
        <input
          id="search"
          placeholder="Search Shreddit"
          autoComplete="off"
          className={cn(
            "w-full min-w-0 rounded-full bg-zinc-400/10 pl-12 pr-6 text-sm text-zinc-300 outline-none ring-1 ring-inset ring-zinc-700/70 placeholder:text-zinc-500 hover:bg-inherit hover:ring-zinc-300 focus:rounded-b-none focus:rounded-t-[1.25rem] focus:bg-inherit focus:ring-zinc-300",
            {
              "rounded-b-none rounded-t-[1.25rem] bg-zinc-400/10": isOpen,
            },
          )}
          onChange={onInputChange}
          onFocus={onInputFocus}
        />
      </div>

      {isOpen && <SearchDropdown searchedValue={searchedValue} />}
    </div>
  );
}
