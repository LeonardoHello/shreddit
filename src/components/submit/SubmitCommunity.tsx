"use client";

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import {
  REDUCER_ACTION_TYPE,
  useSubmitContext,
} from "@/context/SubmitContextProvider";
import useDropdown from "@/hooks/useDropdown";
import { trpc } from "@/trpc/client";
import cn from "@/utils/cn";
import CommunityImage from "../community/CommunityImage";

export default function SubmitCommunity({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dropdownRef, isOpen, setIsOpen } = useDropdown();

  const { state } = useSubmitContext();

  return (
    <div
      className="relative flex w-72 flex-col rounded bg-inherit bg-zinc-900"
      ref={dropdownRef}
    >
      <button
        className={cn(
          "flex basis-full select-none items-center gap-2 rounded border border-zinc-700/70 p-2",
          {
            "rounded-b-none": isOpen,
          },
        )}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {isOpen && <SearchCommunity />}
        {!isOpen && !state.community && <UnselectedCommunity />}
        {!isOpen && state.community && (
          <SelectedCommunity community={state.community} />
        )}

        <ChevronDownIcon className="ml-auto h-4 w-4 min-w-[1rem] stroke-2 text-zinc-500" />
      </button>

      {isOpen && (
        <div
          className="absolute top-full z-10 flex max-h-96 w-full flex-col overflow-x-hidden rounded-b border-x border-b border-zinc-700/70 bg-inherit"
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function SearchCommunity() {
  const { dispatch } = useSubmitContext();

  const utils = trpc.useUtils();

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // replace every character except letters, numbers, underscores and dashes
    const searchedValue = e.currentTarget.value.replaceAll(
      /[^a-zA-Z0-9_-]/g,
      "",
    );

    await utils.searchCommunities.cancel();

    dispatch({
      type: REDUCER_ACTION_TYPE.SEARCHED_COMMUNITY,
      nextSearch: searchedValue,
    });
  };

  return (
    <>
      <MagnifyingGlassIcon className="h-6 w-6 text-zinc-500" />
      <input
        className="truncate bg-inherit text-sm font-medium outline-none placeholder:text-zinc-300"
        placeholder="Search communities"
        autoFocus
        onChange={onInputChange}
      />
    </>
  );
}

function SelectedCommunity({
  community,
}: {
  community: NonNullable<
    ReturnType<typeof useSubmitContext>["state"]["community"]
  >;
}) {
  return (
    <>
      <CommunityImage imageUrl={community.imageUrl} size={24} />

      <h1 className="grow truncate text-start text-sm font-medium">
        r/{community.name}
      </h1>
    </>
  );
}

function UnselectedCommunity() {
  return (
    <>
      <div className="aspect-square h-6 rounded-full border border-dashed border-zinc-500" />
      <h1 className="grow truncate text-start text-sm font-medium">
        Choose a community
      </h1>
    </>
  );
}
