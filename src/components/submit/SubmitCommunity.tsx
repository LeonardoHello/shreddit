"use client";

import { memo, useState } from "react";
import Link from "next/link";

import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client";
import CommunityImage from "../community/CommunityImage";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

const limit = 10;

export default function SubmitCommunity({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchValue, setSearchValue] = useState("");

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { data: myCommunities } = useSuspenseQuery(
    trpc.community.getMyCommunities.queryOptions(),
  );

  const searchCommunitiesQueryKey = trpc.community.searchCommunities.queryKey({
    search: searchValue,
    limit,
  });

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // replace every character except letters, numbers, underscores and dashes
    const searchedValue = e.currentTarget.value.replaceAll(
      /[^a-zA-Z0-9_-]/g,
      "",
    );

    queryClient.cancelQueries({ queryKey: searchCommunitiesQueryKey });

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
            {myCommunities.map((community) => (
              <DropdownMenuItem key={community.id} className="h-11" asChild>
                <Link href={`/submit/r/${community.name}`}>
                  <CommunityImage
                    size={32}
                    className={"min-h-8 min-w-8"}
                    icon={community.icon}
                  />
                  <div className="flex flex-col">
                    <div className="max-w-40 truncate text-sm sm:max-w-52">
                      r/{community.name}
                    </div>
                    <div className="text-2xs text-muted-foreground">
                      {community.memberCount} members
                    </div>
                  </div>
                </Link>
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
    const trpc = useTRPC();

    const { data: searchedCommunities, isLoading } = useQuery(
      trpc.community.searchCommunities.queryOptions({
        search: searchValue,
        limit,
      }),
    );

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
              <Link href={`/submit/r/${community.name}`}>
                <CommunityImage
                  size={32}
                  className={"min-h-8 min-w-8"}
                  icon={community.icon}
                />
                <div className="flex flex-col">
                  <div className="max-w-40 truncate text-sm sm:max-w-52">
                    r/{community.name}
                  </div>
                  <div className="text-2xs text-muted-foreground">
                    {community.memberCount} members
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
      </>
    );
  },
);

SubmitCommunityDropdown.displayName = "SubmitCommunityDropdown";
