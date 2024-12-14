"use client";

import { type ChangeEvent, useState } from "react";

import Link from "next/link";

import { PlusIcon } from "@heroicons/react/24/outline";

import type { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";

import MenuCommunitiesNavigation from "./MenuCommunitiesNavigation";

type Props = {
  initialFavoriteCommunities: RouterOutput["getFavoriteCommunities"];
  initialModeratedCommunities: RouterOutput["getModeratedCommunities"];
  initialJoinedCommunities: RouterOutput["getJoinedCommunities"];
};

export default function MenuCommunities({
  initialFavoriteCommunities,
  initialModeratedCommunities,
  initialJoinedCommunities,
}: Props) {
  const [filter, setFilter] = useState("");

  const queryOptions = {
    refetchOnWindowFocus: false,
    select: (data: Props[keyof Props]) =>
      data
        .filter((communityRelation) =>
          communityRelation.community.name.includes(filter),
        )
        .toSorted((a, b) => (a.community.name < b.community.name ? -1 : 1)),
  };

  const { data: favoriteCommunities } = trpc.getFavoriteCommunities.useQuery(
    undefined,
    {
      ...queryOptions,
      initialData: initialFavoriteCommunities,
    },
  );
  const { data: moderatedCommunities } = trpc.getModeratedCommunities.useQuery(
    undefined,
    {
      ...queryOptions,
      initialData: initialModeratedCommunities,
    },
  );
  const { data: joinedCommunities } = trpc.getJoinedCommunities.useQuery(
    undefined,
    {
      ...queryOptions,
      initialData: initialJoinedCommunities,
    },
  );

  const onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.currentTarget.value);
  };

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

      {favoriteCommunities.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h2 className="px-6 text-2xs uppercase text-zinc-300/60">
            favorites
          </h2>
          <menu className="w-full self-center">
            {favoriteCommunities.map((communityRelation) => (
              <MenuCommunitiesNavigation
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
          {moderatedCommunities.map((communityRelation) => (
            <MenuCommunitiesNavigation
              key={communityRelation.communityId}
              communityRelation={communityRelation}
            />
          ))}
          <li>
            <Link
              href={{ query: { submit: "community" } }}
              scroll={false}
              className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
            >
              <PlusIcon className="h-5 w-5 stroke-2 text-zinc-300" />
              <h2>Create Community</h2>
            </Link>
          </li>
        </menu>
      </div>

      {joinedCommunities.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h2 className="px-6 text-2xs uppercase text-zinc-300/60">
            joined communities
          </h2>
          <menu className="w-full self-center">
            {joinedCommunities.map((communityRelation) => (
              <MenuCommunitiesNavigation
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
