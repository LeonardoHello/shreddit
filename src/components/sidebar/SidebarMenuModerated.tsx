"use client";

import { trpc } from "@/trpc/client";
import SidebarMenuItemFavorite from "./SidebarMenuItemFavorite";

export default function SidebarMenuModerated() {
  const { data: moderatedCommunities } =
    trpc.community.getModeratedCommunities.useQuery();

  if (!moderatedCommunities || moderatedCommunities.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="px-6 text-xs uppercase tracking-widest text-muted-foreground">
        moderation
      </h2>
      <menu className="w-full self-center">
        {moderatedCommunities.map((communityRelation) => (
          <SidebarMenuItemFavorite
            key={communityRelation.communityId}
            communityRelation={communityRelation}
          />
        ))}
      </menu>
    </div>
  );
}
