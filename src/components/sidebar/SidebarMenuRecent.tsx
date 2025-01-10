"use client";

import Link from "next/link";

import { useRecentCommunityContext } from "@/context/RecentCommunityContext";
import CommunityImage from "../community/CommunityImage";
import { Button } from "../ui/button";
import SidebarMenuSkeleton from "./SidebarMenuSkeleton";

export default function SidebarMenuRecent() {
  const state = useRecentCommunityContext();

  if (state.isLoading) {
    return <SidebarMenuSkeleton length={3} />;
  }

  if (state.communities.length === 0) {
    return null;
  }

  return (
    <menu>
      {state.communities.map((community) => (
        <li key={community.id} className="flex">
          <Button
            variant="ghost"
            size="lg"
            className="w-full justify-start px-4 text-sm font-normal tracking-wide hover:bg-accent/40"
            asChild
          >
            <Link href={`/r/${community.name}`}>
              <CommunityImage
                icon={community.icon}
                size={32}
                className="border-2"
              />
              <h2 className="truncate">r/{community.name}</h2>
            </Link>
          </Button>
        </li>
      ))}
    </menu>
  );
}
