"use client";

import Link from "next/link";

import { PlusIcon } from "lucide-react";

import { trpc } from "@/trpc/client";
import SidebarMenuItemFavorite from "./SidebarMenuItemFavorite";

export default function SidebarMenuJoined() {
  const { data: joinedCommunities, isLoading } =
    trpc.community.getJoinedCommunities.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!joinedCommunities || joinedCommunities.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="px-6 text-xs uppercase tracking-widest text-muted-foreground">
        communities
      </h2>
      <menu className="w-full self-center">
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
        {joinedCommunities.map((communityRelation) => (
          <SidebarMenuItemFavorite
            key={communityRelation.communityId}
            communityRelation={communityRelation}
          />
        ))}
      </menu>
    </div>
  );
}
