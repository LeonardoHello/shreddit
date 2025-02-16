"use client";

import { memo, useState } from "react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/trpc/client";
import CommunityImage from "../community/CommunityImage";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

const limit = 10;

export default function SubmitCommunity({
  children,
}: {
  children: React.ReactNode;
}) {
  const [myCommunities] = trpc.community.getMyCommunities.useSuspenseQuery();

  const [searchValue, setSearchValue] = useState("");

  const utils = trpc.useUtils();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // replace every character except letters, numbers, underscores and dashes
    const searchedValue = e.currentTarget.value.replaceAll(
      /[^a-zA-Z0-9_-]/g,
      "",
    );

    utils.community.searchCommunities.cancel({
      search: searchValue,
      limit,
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
        <DropdownMenuLabel className="text-2xs uppercase text-muted-foreground">
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
            <DropdownMenuLabel className="text-2xs uppercase text-muted-foreground">
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
    const { data: searchedCommunities, isLoading } =
      trpc.community.searchCommunities.useQuery({ search: searchValue, limit });

    return (
      <>
        <DropdownMenuLabel className="text-2xs uppercase text-muted-foreground">
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
