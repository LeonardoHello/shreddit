"use client";

import { type ChangeEvent, useState } from "react";

import Link from "next/link";

import { PlusIcon } from "@heroicons/react/24/outline";

import type { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";
import type { ArrElement } from "@/types";

import YourCommunitiesNavigation from "./YourCommunitiesNavigation";

type Props = {
  favoriteCommunities: RouterOutput["favoriteCommunities"];
  moderatedCommunities: RouterOutput["moderatedCommunities"];
  joinedCommunities: RouterOutput["joinedCommunities"];
};

type CommunityRelations = Props[
  | "favoriteCommunities"
  | "moderatedCommunities"
  | "joinedCommunities"];

export default function YourCommunities({
  favoriteCommunities,
  moderatedCommunities,
  joinedCommunities,
}: Props) {
  const [filter, setFilter] = useState("");

  const select = (data: CommunityRelations) =>
    data.filter((communityRelation) =>
      communityRelation.community.name.includes(filter),
    );

  const queryOptions = {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    select,
  };

  const favoriteCommunitiesQuery = trpc.favoriteCommunities.useQuery(
    undefined,
    {
      initialData: favoriteCommunities,
      ...queryOptions,
    },
  );
  const moderatedCommunitiesQuery = trpc.moderatedCommunities.useQuery(
    undefined,
    {
      initialData: moderatedCommunities,
      ...queryOptions,
    },
  );
  const joinedCommunitiesQuery = trpc.joinedCommunities.useQuery(undefined, {
    initialData: joinedCommunities,
    ...queryOptions,
  });

  const onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.currentTarget.value);
  };

  const alphabeticalSorting = (
    a: ArrElement<CommunityRelations>,
    b: ArrElement<CommunityRelations>,
  ) => (a.community.name < b.community.name ? -1 : 1);

  return (
    <>
      <input
        type="text"
        name="first-name"
        id="first-name"
        autoFocus
        placeholder="Filter"
        autoComplete="off"
        className="mx-4 min-w-0 bg-zinc-400/10 px-2 py-[3px] text-zinc-300 outline-none ring-1 ring-inset ring-zinc-700 hover:bg-inherit hover:ring-zinc-300 focus:bg-inherit focus:ring-zinc-300"
        onChange={onFilterChange}
      />

      {favoriteCommunitiesQuery.data.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h2 className="px-6 text-2xs uppercase text-zinc-300/60">
            favorites
          </h2>
          <menu className="w-full self-center">
            {favoriteCommunitiesQuery.data
              .sort(alphabeticalSorting)
              .map((communityRelation) => (
                <YourCommunitiesNavigation
                  key={communityRelation.communityId}
                  communityRelation={communityRelation}
                />
              ))}
          </menu>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <h2 className="px-6 text-2xs uppercase text-zinc-300/60">moderating</h2>
        <menu className="w-full self-center">
          <li>
            <Link
              href="/submit"
              className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
            >
              <PlusIcon className="h-5 w-5 stroke-2 text-zinc-300" />
              <h2>Create Community</h2>
            </Link>
          </li>
          {moderatedCommunitiesQuery.data
            .sort(alphabeticalSorting)
            .map((communityRelation) => (
              <YourCommunitiesNavigation
                key={communityRelation.communityId}
                communityRelation={communityRelation}
              />
            ))}
        </menu>
      </div>

      {joinedCommunitiesQuery.data.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h2 className="px-6 text-2xs uppercase text-zinc-300/60">
            joined communities
          </h2>
          <menu className="w-full self-center">
            {joinedCommunitiesQuery.data
              .sort(alphabeticalSorting)
              .map((communityRelation) => (
                <YourCommunitiesNavigation
                  key={communityRelation.communityId}
                  communityRelation={communityRelation}
                />
              ))}
          </menu>
        </div>
      )}
    </>
  );
}