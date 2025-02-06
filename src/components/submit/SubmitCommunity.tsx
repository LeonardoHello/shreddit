"use client";

import Link from "next/link";

import { User } from "@clerk/nextjs/server";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ReducerAction,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { trpc } from "@/trpc/client";
import CommunityImage from "../community/CommunityImage";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

export default function SubmitCommunity({
  children,
  username,
  imageUrl,
}: {
  children: React.ReactNode;
  username: User["username"];
  imageUrl: User["imageUrl"];
}) {
  const [myCommunities] = trpc.community.getMyCommunities.useSuspenseQuery();

  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  const utils = trpc.useUtils();

  const { data: searchedCommunities, isFetching } =
    trpc.community.searchCommunities.useQuery(
      { search: state.communitySearch },
      {
        initialData: [],
        refetchOnMount: false,
        retry: 2,
        throwOnError: () => {
          toast.error("There was a problem with fetching the communities");
          return false;
        },
      },
    );

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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent
        style={{
          scrollbarWidth: "thin",
          colorScheme: "dark",
          scrollbarColor: "hsl(var(--muted-foreground)/0.4) transparent",
        }}
        className="z-0 max-h-96 w-60 overflow-y-auto bg-card sm:w-72"
      >
        <DropdownMenuLabel className="text-2xs uppercase text-muted-foreground">
          search communities
        </DropdownMenuLabel>

        <div className="px-2">
          <Input
            className="mb-2 h-8"
            autoFocus
            defaultValue={state.communitySearch}
            onChange={onInputChange}
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-2xs uppercase text-muted-foreground">
          your profile
        </DropdownMenuLabel>
        <DropdownMenuItem className="h-11" asChild>
          <Link href={`/u/${username}`}>
            <Avatar className="size-8">
              <AvatarImage src={imageUrl} />
              <AvatarFallback>{username?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="max-w-40 truncate text-sm sm:max-w-52">
              u/{username}
            </span>
          </Link>
        </DropdownMenuItem>

        {state.communitySearch.length > 0 && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-2xs uppercase text-muted-foreground">
              searched communities
            </DropdownMenuLabel>
            {isFetching && (
              <DropdownMenuItem className="h-11" disabled>
                <Skeleton className="size-8 rounded-full" />

                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </DropdownMenuItem>
            )}
            {!isFetching &&
              searchedCommunities.map((community) => (
                <DropdownMenuItem key={community.id} className="h-11" asChild>
                  <Link href={`/r/${community.name}/submit`}>
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

        {state.communitySearch.length === 0 && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-2xs uppercase text-muted-foreground">
              Your communities
            </DropdownMenuLabel>
            {myCommunities.map((community) => (
              <DropdownMenuItem key={community.id} className="h-11" asChild>
                <Link href={`/r/${community.name}/submit`}>
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
