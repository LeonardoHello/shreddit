"use client";

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { useDropdownContext } from "@/context/DropdownContext";
import {
  ReducerAction,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { trpc } from "@/trpc/client";

export default function SubmitCommunitySearch() {
  const { isOpen, setIsOpen } = useDropdownContext();

  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const utils = trpc.useUtils();

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // replace every character except letters, numbers, underscores and dashes
    const searchedValue = e.currentTarget.value.replaceAll(
      /[^a-zA-Z0-9_-]/g,
      "",
    );

    await utils.community.searchCommunities.cancel();

    dispatch({
      type: ReducerAction.SEARCH_COMMUNITY,
      nextCommunitySearch: searchedValue,
    });
  };

  return (
    <div className="relative flex w-72 flex-col rounded bg-zinc-900">
      <button className="flex basis-full select-none items-center gap-2 rounded rounded-b-none border border-zinc-700/70 p-2">
        <MagnifyingGlassIcon className="h-6 w-6 text-zinc-500" />

        <input
          className="grow truncate bg-inherit text-sm font-medium outline-none placeholder:text-zinc-300"
          placeholder="Search communities"
          autoFocus
          defaultValue={state.communitySearch}
          onChange={onInputChange}
        />

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
