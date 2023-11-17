"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import useDropdownClose from "@/lib/hooks/useDropdownClose";
import cn from "@/lib/utils/cn";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import SearchDropdown from "./SearchDropdown";

import type { ChangeEvent, FocusEvent } from "react";
export default function Search() {
  const pathname = usePathname();
  const [searchedValue, setSearchedValue] = useState("");

  const { dropdownRef, isOpen, setIsOpen } = useDropdownClose();

  useEffect(() => {
    setIsOpen(false);
    return () => {
      setIsOpen(false);
    };
  }, [pathname, setIsOpen]);

  const onInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // replace every character except letters, numbers, underscores and dashes
    const searchedValue = e.currentTarget.value.replaceAll(
      /[^a-zA-Z0-9_-]/g,
      "",
    );
    setSearchedValue(searchedValue);

    if (searchedValue.length === 0 && isOpen === true) {
      setIsOpen(false);
    } else if (searchedValue.length > 0 && isOpen === false) {
      setIsOpen(true);
    }
  };

  const onInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div
      className="relative order-1 flex max-w-4xl grow flex-col bg-inherit"
      ref={dropdownRef}
    >
      <div className="relative flex basis-full">
        <label htmlFor="search" className="absolute left-4 self-center">
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

      {isOpen ? <SearchDropdown searchedValue={searchedValue} /> : null}
    </div>
  );
}
