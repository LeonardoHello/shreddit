"use client";

import Link from "next/link";

import { Plus } from "lucide-react";

import { trpc } from "@/trpc/client";
import { Button } from "../ui/button";
import SidebarMenuItemFavorite from "./SidebarMenuItemFavorite";

export default function SidebarMenuJoined() {
  const [joinedCommunities] =
    trpc.community.getJoinedCommunities.useSuspenseQuery();

  if (!joinedCommunities || joinedCommunities.length === 0) {
    return null;
  }

  return (
    <menu>
      <li>
        <Button
          variant="ghost"
          size="lg"
          className="w-full justify-start px-4 text-sm font-normal hover:bg-accent/40"
          asChild
        >
          <Link href={{ query: { submit: "community" } }} scroll={false}>
            <Plus className="size-8 stroke-1" />
            <h2>Create Community</h2>
          </Link>
        </Button>
      </li>
      {joinedCommunities
        .sort((a, b) => {
          if (a.favorited !== b.favorited) {
            return b.favorited ? 1 : -1;
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
