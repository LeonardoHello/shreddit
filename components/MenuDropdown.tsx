"use client";

import { type ChangeEvent, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useUser } from "@clerk/nextjs";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon, HomeIcon, UserIcon } from "@heroicons/react/24/solid";

import type {
  getFavoriteCommunities,
  getJoinedCommunities,
  getModeratedCommunities,
} from "@/lib/api/communities";

import MenuNavigation from "./MenuNavigation";

type Prop = {
  moderatedCommunityList: Awaited<ReturnType<typeof getFavoriteCommunities>>;
  favoriteCommunityList: Awaited<ReturnType<typeof getModeratedCommunities>>;
  joinedCommunityList: Awaited<ReturnType<typeof getJoinedCommunities>>;
};

export default function MenuDropdown({
  moderatedCommunityList,
  favoriteCommunityList,
  joinedCommunityList,
}: Prop) {
  const [moderatedCommunities, setModeratedComunities] = useState(
    moderatedCommunityList,
  );
  const [favoriteCommunities, setFavoriteCommunities] = useState(
    favoriteCommunityList,
  );
  const [joinedCommunities, setJoinedCommunities] =
    useState(joinedCommunityList);

  const { isSignedIn, user, isLoaded } = useUser();

  const onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setModeratedComunities(
      moderatedCommunityList.filter((communityRelation) =>
        communityRelation.community.name.includes(e.currentTarget.value),
      ),
    );
    setFavoriteCommunities(
      favoriteCommunityList.filter((communityRelation) =>
        communityRelation.community.name.includes(e.currentTarget.value),
      ),
    );
    setJoinedCommunities(
      joinedCommunities.filter((communityRelation) =>
        communityRelation.community.name.includes(e.currentTarget.value),
      ),
    );
  };

  return (
    <div className="absolute top-full z-10 flex max-h-[30rem] w-64 flex-col gap-5 overflow-x-hidden rounded-b border-x border-b border-zinc-700/70 bg-inherit py-4 md:w-full">
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

      {favoriteCommunities.length > 0 ? (
        <MenuNavigation
          communityRelations={favoriteCommunities}
          title="favorites"
        />
      ) : null}

      <MenuNavigation
        communityRelations={moderatedCommunities}
        title="moderating"
      >
        <li>
          <Link
            href="/submit"
            className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
          >
            <PlusIcon className="h-5 w-5 stroke-2 text-zinc-300" />
            <h2>Create Community</h2>
          </Link>
        </li>
      </MenuNavigation>

      {joinedCommunities.length > 0 ? (
        <MenuNavigation
          communityRelations={joinedCommunities}
          title="joined communities"
        />
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
