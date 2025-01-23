"use client";

import { trpc } from "@/trpc/client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import SidebarNavItem from "./SidebarNavItem";

export default function SidebarNavMuted() {
  const [mutedCommunities] =
    trpc.community.getMutedCommunities.useSuspenseQuery();

  if (!mutedCommunities || mutedCommunities.length === 0) {
    return null;
  }

  return (
    <AccordionItem value="item-4">
      <AccordionTrigger className="px-4 text-xs font-light uppercase tracking-widest text-muted-foreground hover:no-underline">
        muted
      </AccordionTrigger>
      <AccordionContent>
        <nav>
          <ul>
            {mutedCommunities
              .sort((a, b) => {
                if (a.favorited !== b.favorited) {
                  return b.favorited ? 1 : -1;
                }
                return a.community.name.localeCompare(b.community.name);
              })
              .map((communityRelation) => (
                <SidebarNavItem
                  key={communityRelation.community.id}
                  communityRelation={communityRelation}
                />
              ))}
          </ul>
        </nav>
      </AccordionContent>
    </AccordionItem>
  );
}
