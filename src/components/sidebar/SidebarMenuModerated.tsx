"use client";

import { trpc } from "@/trpc/client";
import SidebarMenuItemFavorite from "./SidebarMenuItemFavorite";
import SidebarMenuSkeleton from "./SidebarMenuSkeleton";

export default function SidebarMenuModerated() {
  const { data: moderatedCommunities, isLoading } =
    trpc.community.getModeratedCommunities.useQuery();

  if (isLoading) {
    return <SidebarMenuSkeleton length={2} />;
  }

  if (!moderatedCommunities || moderatedCommunities.length === 0) {
    return null;
  }

  return (
    <menu>
      {moderatedCommunities
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
