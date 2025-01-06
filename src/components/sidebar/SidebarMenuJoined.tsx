"use client";

import Link from "next/link";

import { PlusIcon } from "lucide-react";

import { trpc } from "@/trpc/client";
import SidebarMenuItemFavorite from "./SidebarMenuItemFavorite";
import SidebarMenuSkeleton from "./SidebarMenuSkeleton";

export default function SidebarMenuJoined() {
  const { data: joinedCommunities, isLoading } =
    trpc.community.getJoinedCommunities.useQuery();

  if (isLoading) {
    return <SidebarMenuSkeleton length={6} />;
  }

  if (!joinedCommunities || joinedCommunities.length === 0) {
    return null;
  }

  return (
    <menu>
      <li>
        <Link
          href={{ query: { submit: "community" } }}
          scroll={false}
          className="flex h-9 items-center gap-2 rounded-md px-6 text-sm hover:bg-zinc-700/30"
        >
          <PlusIcon className="h-5 w-5 stroke-2 text-zinc-300" />
          <h2>Create Community</h2>
        </Link>
      </li>
      {joinedCommunities
        .sort((a, b) => {
          if (a.favorite !== b.favorite) {
            return b.favorite ? 1 : -1;
          }
          return a.community.name.localeCompare(b.community.name);
        })
        .map((communityRelation) => (
          <SidebarMenuItemFavorite
            key={communityRelation.communityId}
            communityRelation={communityRelation}
          />
        ))}
    </menu>
  );
}
