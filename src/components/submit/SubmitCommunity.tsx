"use client";

import { memo, useState } from "react";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { client } from "@/hono/client";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import CommunityIcon from "../community/CommunityIcon";
import { HoverPrefetchLink } from "../ui/hover-prefetch-link";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

export default function SubmitCommunity({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchValue, setSearchValue] = useState("");

  const queryClient = getQueryClient();

  const { data: joinedCommunities } = useSuspenseQuery({
    queryKey: ["users", "me", "communities", "joined", "submit"],
    queryFn: async () => {
      const res = await client.users.me.communities.joined.submit.$get();
      return res.json();
    },
  });

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // replace every character except letters, numbers, underscores and dashes
    const searchedValue = e.currentTarget.value.replaceAll(
      /[^a-zA-Z0-9_-]/g,
      "",
    );

    queryClient.cancelQueries({
      queryKey: ["communities", "search", searchedValue],
    });

    setSearchValue(searchedValue);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent
        style={{
          scrollbarWidth: "thin",
          colorScheme: "dark",
          scrollbarColor: "hsl(var(--muted-foreground)/0.4) transparent",
        }}
        className="z-0 max-h-96 w-60 overflow-y-auto sm:w-72"
      >
        <DropdownMenuLabel className="text-2xs text-muted-foreground uppercase">
          search communities
        </DropdownMenuLabel>

        <div className="px-2">
          <Input
            className="mb-2 h-8"
            autoFocus
            defaultValue={searchValue}
            onChange={onInputChange}
          />
        </div>

        <DropdownMenuSeparator />

        {searchValue.length !== 0 && (
          <SubmitCommunityDropdown searchValue={searchValue} />
        )}

        {searchValue.length === 0 && (
          <>
            <DropdownMenuLabel className="text-2xs text-muted-foreground uppercase">
              Your communities
            </DropdownMenuLabel>
            {joinedCommunities.map((community) => (
              <DropdownMenuItem key={community.id} className="h-11" asChild>
                <HoverPrefetchLink href={`/submit/r/${community.name}`}>
                  <CommunityIcon
                    icon={community.icon}
                    iconPlaceholder={community.iconPlaceholder}
                    communtiyName={community.name}
                    size={32}
                    className="aspect-square rounded-full object-cover select-none"
                  />
                  <div className="flex flex-col">
                    <div className="max-w-40 truncate text-sm sm:max-w-52">
                      r/{community.name}
                    </div>
                    <div className="text-2xs text-muted-foreground">
                      {community.memberCount} members
                    </div>
                  </div>
                </HoverPrefetchLink>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const SubmitCommunityDropdown = memo(
  ({ searchValue }: { searchValue: string }) => {
    const { data: searchedCommunities, isLoading } = useQuery({
      queryKey: ["communities", "search", searchValue],
      queryFn: async () => {
        const res = await client.communities.search.$get({
          query: { search: searchValue, limit: "10" },
        });
        return res.json();
      },
    });

    return (
      <>
        <DropdownMenuLabel className="text-2xs text-muted-foreground uppercase">
          searched communities
        </DropdownMenuLabel>
        {isLoading && (
          <DropdownMenuItem className="h-11" disabled>
            <Skeleton className="size-8 rounded-full" />

            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-2 w-16" />
            </div>
          </DropdownMenuItem>
        )}
        {!isLoading &&
          searchedCommunities?.map((community) => (
            <DropdownMenuItem key={community.id} className="h-11" asChild>
              <HoverPrefetchLink href={`/submit/r/${community.name}`}>
                <CommunityIcon
                  icon={community.icon}
                  iconPlaceholder={community.iconPlaceholder}
                  communtiyName={community.name}
                  size={32}
                  className="aspect-square rounded-full object-cover select-none"
                />
                <div className="flex flex-col">
                  <div className="max-w-40 truncate text-sm sm:max-w-52">
                    r/{community.name}
                  </div>
                  <div className="text-2xs text-muted-foreground">
                    {community.memberCount} members
                  </div>
                </div>
              </HoverPrefetchLink>
            </DropdownMenuItem>
          ))}
      </>
    );
  },
);

SubmitCommunityDropdown.displayName = "SubmitCommunityDropdown";
