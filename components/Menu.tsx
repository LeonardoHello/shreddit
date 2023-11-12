"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon, HomeIcon, UserIcon } from "@heroicons/react/24/solid";

import MenuNavigation from "./MenuNavigation";

import type { Community, UserToCommunity } from "@/db/schema";

type communityRelation = (Pick<
  UserToCommunity,
  "userId" | "communityId" | "favorite"
> & {
  community: Pick<Community, "name" | "imageUrl">;
})[];

type Prop = {
  favoriteCommunities: communityRelation;
  ownedCommunities: communityRelation;
  joinedCommunities: communityRelation;
};

export default function Menu({
  favoriteCommunities,
  ownedCommunities,
  joinedCommunities,
}: Prop) {
  const [filter, setFilter] = useState("");
  const [favorites, setFavorites] = useState(favoriteCommunities);
  const [moderating, setModerating] = useState(ownedCommunities);
  const [yourCommunities, setYourCommunities] = useState(joinedCommunities);

  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    setFavorites(
      favoriteCommunities.filter((communityRelation) =>
        communityRelation.community.name.includes(filter),
      ),
    );
    setModerating(
      ownedCommunities.filter((communityRelation) =>
        communityRelation.community.name.includes(filter),
      ),
    );
    setYourCommunities(
      joinedCommunities.filter((communityRelation) =>
        communityRelation.community.name.includes(filter),
      ),
    );
  }, [filter, favoriteCommunities, joinedCommunities, ownedCommunities]);

  return (
    <div className="absolute top-full z-10 flex max-h-[30rem] w-64 flex-col gap-5 overflow-x-hidden rounded-b border-x border-b border-zinc-700 bg-inherit py-4 md:w-full">
      <input
        type="text"
        name="first-name"
        id="first-name"
        autoFocus
        placeholder="Filter"
        autoComplete="off"
        className="mx-4 min-w-0 bg-zinc-400/10 px-2 py-[3px] text-zinc-300 outline-none ring-1 ring-inset ring-zinc-700 hover:bg-inherit hover:ring-zinc-300 focus:bg-inherit focus:ring-zinc-300"
        onChange={(e) => setFilter(e.currentTarget.value)}
      />

      {favorites.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          <h2 className="px-6 text-2xs text-zinc-300/60">FAVORITES</h2>
          <menu className="w-full self-center">
            {favorites
              .sort((a, b) => (a.community.name < b.community.name ? -1 : 1))
              .map((communityRelation) => (
                <MenuNavigation
                  key={communityRelation.communityId}
                  communityRelation={communityRelation}
                />
              ))}
          </menu>
        </div>
      ) : null}

      <div className="flex flex-col gap-2.5">
        <h2 className="px-6 text-2xs text-zinc-300/60">MODERATED</h2>
        <menu className="w-full self-center">
          {moderating
            .sort((a, b) => (a.community.name < b.community.name ? -1 : 1))
            .map((communityRelation) => (
              <MenuNavigation
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

      {yourCommunities.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          <h2 className="px-6 text-2xs text-zinc-300/60">YOUR COMMUNITIES</h2>
          <menu className="w-full self-center">
            {yourCommunities
              .sort((a, b) => (a.community.name < b.community.name ? -1 : 1))
              .map((communityRelation) => (
                <MenuNavigation
                  key={communityRelation.communityId}
                  communityRelation={communityRelation}
                />
              ))}
          </menu>
        </div>
      ) : null}

      <div className="flex flex-col gap-2.5">
        <h2 className="px-6 text-2xs text-zinc-300/60">FEEDS</h2>
        <menu className="w-full self-center">
          <li>
            <Link
              href="/"
              className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
            >
              <HomeIcon className="h-5 w-5" />
              <h2>Home</h2>
            </Link>
          </li>
          <li>
            <Link
              href="/all"
              className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
            >
              <ChartBarIcon
                className="h-5 w-5 rounded-full bg-zinc-300 stroke-[3] p-0.5 text-zinc-900"
                width={20}
                height={20}
              />
              <h2>All</h2>
            </Link>
          </li>
        </menu>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="px-6 text-2xs text-zinc-300/60">OTHER</h2>
        <menu className="w-full self-center">
          <li>
            <Link
              href={`/u/${user?.username}`}
              className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
            >
              {isSignedIn && isLoaded ? (
                <Image
                  src={user.imageUrl}
                  alt="profile icon"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <UserIcon className="h-6 w-6 animate-pulse rounded-full bg-zinc-300 p-0.5 text-zinc-800" />
              )}

              <h2>User Profile</h2>
            </Link>
          </li>
          <li>
            <Link
              href="/submit"
              className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
            >
              <PlusIcon className="h-6 w-6 stroke-2 text-zinc-300" />
              <h2>Create Post</h2>
            </Link>
          </li>
        </menu>
      </div>
    </div>
  );
}
