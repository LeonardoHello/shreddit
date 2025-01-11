"use client";

import { trpc } from "@/trpc/client";
import SidebarMenuItemFavorite from "./SidebarMenuItemFavorite";

export default function SidebarMenuModerated() {
  const [moderatedCommunities] =
    trpc.community.getModeratedCommunities.useSuspenseQuery();

  if (!moderatedCommunities || moderatedCommunities.length === 0) {
    return null;
  }

  return (
    <menu>
      {moderatedCommunities
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
