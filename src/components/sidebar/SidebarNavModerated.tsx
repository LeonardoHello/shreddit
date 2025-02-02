"use client";

import { trpc } from "@/trpc/client";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import SidebarDialog from "./SidebarDialog";
import SidebarNavItem from "./SidebarNavItem";

export default function SidebarNavModerated() {
  const [moderatedCommunities] =
    trpc.community.getModeratedCommunities.useSuspenseQuery();

  return (
    <AccordionItem value="item-2">
      <AccordionTrigger className="px-4 text-xs font-light uppercase tracking-widest text-muted-foreground hover:no-underline">
        moderated
      </AccordionTrigger>
      <AccordionContent>
        <nav>
          <ul>
            <SidebarDialog />

            {moderatedCommunities &&
              moderatedCommunities.length > 0 &&
              moderatedCommunities
                .sort((a, b) => {
                  if (a.favorited !== b.favorited) {
                    return b.favorited ? 1 : -1;
                  }
                  return a.community.name.localeCompare(b.community.name);
                })
                .map((userToCommunity) => (
                  <SidebarNavItem
                    key={userToCommunity.community.id}
                    userToCommunity={userToCommunity}
                    canFavorite
                  />
                ))}
          </ul>
        </nav>
      </AccordionContent>
    </AccordionItem>
  );
}
