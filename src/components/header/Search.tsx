"use client";

import { memo, useRef, useState } from "react";
import Image from "next/image";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";

import useDropdown from "@/hooks/useDropdown";
import { useTRPC } from "@/trpc/client";
import defaultCommunityIcon from "@public/defaultCommunityIcon.png";
import defaultUserImage from "@public/defaultUserImage.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { HoverPrefetchLink } from "../ui/hover-prefetch-link";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import SearchSkeleton from "./SearchSkeleton";

const limit = 4;

export function Search() {
  const [searchedValue, setSearchedValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const { ref: dropdownRef, isOpen, setIsOpen } = useDropdown(ref);

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const searchCommunitiesQueryKey = trpc.community.searchCommunities.queryKey();
  const searchUsersQueryKey = trpc.user.searchUsers.queryKey();

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // replace every character except letters, numbers, underscores and dashes
    const searchedValue = e.currentTarget.value.replaceAll(
      /[^a-zA-Z0-9_-]/g,
      "",
    );

    queryClient.cancelQueries({
      queryKey: [searchCommunitiesQueryKey, searchUsersQueryKey],
    });

    setSearchedValue(searchedValue);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchedValue("");
  };

  return (
    <div
      ref={dropdownRef}
      className="max-w-md grow sm:relative lg:max-w-md xl:max-w-lg"
    >
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search Shreddit
        </Label>
        <Input
          id="search"
          placeholder="Search Shreddit"
          className="bg-input h-10 rounded-full pl-11"
          autoComplete="off"
          value={searchedValue}
          onChange={onInputChange}
          onFocus={() => setIsOpen(true)}
        />
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 stroke-[1.5] opacity-50 select-none" />
      </div>

      <AnimatePresence>
        {isOpen && searchedValue.length !== 0 && (
          <SearchDropdown
            searchedValue={searchedValue}
            closeDropdown={closeDropdown}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const SearchDropdown = memo(
  ({
    searchedValue,
    closeDropdown,
  }: {
    searchedValue: string;
    closeDropdown: () => void;
  }) => {
    const trpc = useTRPC();

    const { data: searchedCommunities, isLoading: isLoadingCommunities } =
      useQuery(
        trpc.community.searchCommunities.queryOptions({
          search: searchedValue,
          limit,
        }),
      );
    const { data: searchedUsers, isLoading: isLoadingUsers } = useQuery(
      trpc.user.searchUsers.queryOptions(searchedValue),
    );

    const isLoading = isLoadingCommunities || isLoadingUsers;

    return (
      <motion.div
        key="box"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{
          duration: 0.2,
          scale: { type: "spring", visualDuration: 0.2, bounce: 0.4 },
        }}
        style={{
          scrollbarWidth: "thin",
          colorScheme: "dark",
          scrollbarColor: "hsl(var(--muted-foreground)/.4) transparent",
        }}
        className="bg-card absolute top-[60px] left-2 flex max-h-[min(calc(100vh-4rem),24rem)] w-[calc(100vw-1rem)] flex-col gap-4 overflow-y-auto rounded-xl border p-2 sm:top-12 sm:left-0 sm:w-full"
      >
        {isLoading && <SearchSkeleton />}

        {!isLoading && searchedCommunities?.length !== 0 && (
          <div className="flex flex-col gap-1">
            <div className="mx-4 text-sm font-medium">Communities</div>
            {searchedCommunities?.map((community) => (
              <Button
                key={community.name}
                variant={"ghost"}
                asChild
                className="h-12 justify-start"
                onClick={closeDropdown}
              >
                <HoverPrefetchLink href={`/r/${community.name}`}>
                  <Image
                    src={community.icon ?? defaultCommunityIcon}
                    alt={`${community.name} community icon`}
                    width={28}
                    height={28}
                    className="rounded-full object-contain select-none"
                  />

                  <div className="w-0 grow">
                    <div className="truncate text-sm font-medium">
                      r/{community.name}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(community.memberCount)}{" "}
                      {community.memberCount === 1 ? "member" : "members"}
                    </div>
                  </div>
                </HoverPrefetchLink>
              </Button>
            ))}
          </div>
        )}

        {!isLoading && searchedUsers?.length !== 0 && (
          <div className="flex flex-col gap-1">
            <div className="mx-4 text-sm font-medium">Users</div>
            {searchedUsers?.map((user) => (
              <Button
                key={user.username}
                variant={"ghost"}
                asChild
                className="h-12 justify-start"
                onClick={closeDropdown}
              >
                <HoverPrefetchLink href={`/u/${user.username}`}>
                  <Avatar className="size-7">
                    <AvatarImage src={user.image ?? defaultUserImage.src} />
                    <AvatarFallback className="uppercase">
                      {user.username?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-0 grow">
                    <div className="truncate text-sm font-medium">
                      u/{user.username}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(user.onionCount)}{" "}
                      {user.onionCount === 1 ? "onion" : "onions"}
                    </div>
                  </div>
                </HoverPrefetchLink>
              </Button>
            ))}
          </div>
        )}
      </motion.div>
    );
  },
);

SearchDropdown.displayName = "SearchDropdown";
