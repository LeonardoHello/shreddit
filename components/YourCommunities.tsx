"use client";

import { type ChangeEvent, useState } from "react";

import Link from "next/link";

import { PlusIcon } from "@heroicons/react/24/outline";

import type { ArrElement } from "@/lib/types";
import type { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

import YourCommunitiesNavigation from "./YourCommunitiesNavigation";

type Props = {
  favoriteCommunities: RouterOutput["getFavoriteCommunities"];
  moderatedCommunities: RouterOutput["getModeratedCommunities"];
  joinedCommunities: RouterOutput["getJoinedCommunities"];
};

export default function YourCommunities({
  favoriteCommunities,
  moderatedCommunities,
  joinedCommunities,
}: Props) {
  const [filter, setFilter] = useState("");

  const select = (data: Props[keyof Props]) =>
    data.filter((communityRelation) =>
      communityRelation.community.name.includes(filter),
    );

  const queryOptions = {
    refetchOnWindowFocus: false,
    select,
  };

  const { data: favoriteCommunitiesQuery } =
    trpc.getFavoriteCommunities.useQuery(undefined, {
      initialData: favoriteCommunities,
      ...queryOptions,
    });
  const { data: moderatedCommunitiesQuery } =
    trpc.getModeratedCommunities.useQuery(undefined, {
      initialData: moderatedCommunities,
      ...queryOptions,
    });
  const { data: joinedCommunitiesQuery } = trpc.getJoinedCommunities.useQuery(
    undefined,
    {
      initialData: joinedCommunities,
      ...queryOptions,
    },
  );

  const onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.currentTarget.value);
  };

  const alphabetically = (
    a: ArrElement<Props[keyof Props]>,
    b: ArrElement<Props[keyof Props]>,
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

      {favoriteCommunitiesQuery.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h2 className="px-6 text-2xs uppercase text-zinc-300/60">
            favorites
          </h2>
          <menu className="w-full self-center">
            {favoriteCommunitiesQuery
              .toSorted(alphabetically)
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
          {moderatedCommunitiesQuery
            .toSorted(alphabetically)
            .map((communityRelation) => (
              <YourCommunitiesNavigation
                key={communityRelation.communityId}
                communityRelation={communityRelation}
              />
            ))}
          <li>
            <Link
              href="/submit"
              className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
            >
              <PlusIcon className="h-5 w-5 stroke-2 text-zinc-300" />
              <h2>Create Community</h2>
            </Link>
          </li>
        </menu>
      </div>

      {joinedCommunitiesQuery.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h2 className="px-6 text-2xs uppercase text-zinc-300/60">
            joined communities
          </h2>
          <menu className="w-full self-center">
            {joinedCommunitiesQuery
              .toSorted(alphabetically)
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
