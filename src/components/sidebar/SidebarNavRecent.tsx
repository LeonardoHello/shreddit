"use client";

import { useRecentCommunityContext } from "@/context/RecentCommunityContext";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import SidebarNavItem from "./SidebarNavItem";
import SidebarNavSkeleton from "./SidebarNavSkeleton";

export default function SidebarNavRecent() {
  const state = useRecentCommunityContext();

  if (state.isLoading) {
    return <SidebarNavSkeleton length={4} favorite={false} />;
  }

  if (state.communities.length === 0) {
    return null;
  }

  return (
    <AccordionItem value="item-1">
      <AccordionTrigger className="px-4 text-xs font-light uppercase tracking-widest text-muted-foreground hover:no-underline">
        recent
      </AccordionTrigger>
      <AccordionContent>
        <nav>
          <ul>
            {state.communities.map((community) => (
              <SidebarNavItem
                key={community.id}
                communityRelation={{ community, favorited: false }}
                canFavorite={false}
              />
            ))}
          </ul>
        </nav>
      </AccordionContent>
    </AccordionItem>
  );
}
