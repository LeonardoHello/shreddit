"use client";

import { trpc } from "@/trpc/client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import SidebarMenuItemFavorite from "./SidebarMenuItemFavorite";

export default function SidebarMenuJoined() {
  const [joinedCommunities] =
    trpc.community.getJoinedCommunities.useSuspenseQuery();

  if (!joinedCommunities || joinedCommunities.length === 0) {
    return null;
  }

  return (
    <AccordionItem value="item-3">
      <AccordionTrigger className="px-4 text-xs font-light uppercase tracking-widest text-muted-foreground hover:no-underline">
        communities
      </AccordionTrigger>
      <AccordionContent>
        <menu>
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
      </AccordionContent>
    </AccordionItem>
  );
}
