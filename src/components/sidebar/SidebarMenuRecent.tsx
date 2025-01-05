"use client";

import Link from "next/link";

import { useRecentCommunityContext } from "@/context/RecentCommunityContext";
import CommunityImage from "../community/CommunityImage";

export default function SidebarMenuRecent() {
  const state = useRecentCommunityContext();

  if (state.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="px-6 text-xs uppercase tracking-widest text-muted-foreground">
        recent
      </h2>
      <menu className="w-full self-center">
        {state.map((community) => (
          <li key={community.id}>
            <Link
              href={`/r/${community.name}`}
              className="flex h-10 items-center gap-2 rounded-md px-4 text-sm hover:bg-zinc-700/30"
            >
              <CommunityImage
                imageUrl={community.imageUrl}
                size={32}
                className="border-2"
              />
              <h2 className="truncate">r/{community.name}</h2>
            </Link>
          </li>
        ))}
      </menu>
    </div>
  );
}
