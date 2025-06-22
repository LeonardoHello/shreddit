"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRecentCommunityContext } from "@/context/RecentCommunityContext";
import CommunityImage from "../community/CommunityImage";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { HoverPrefetchLink } from "../ui/hover-prefetch-link";
import SidebarNavSkeleton from "./SidebarNavSkeleton";

export default function SidebarNavRecent() {
  const state = useRecentCommunityContext();

  const { isMobile, setOpenMobile } = useSidebar();

  if (state.isLoading) {
    return <SidebarNavSkeleton length={4} />;
  }

  if (state.communities.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <AccordionItem value="recent">
        <SidebarGroupLabel asChild className="group/label">
          <AccordionTrigger>RECENT</AccordionTrigger>
        </SidebarGroupLabel>
        <AccordionContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {state.communities.map((community) => (
                <SidebarMenuItem key={community.id}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => {
                      if (isMobile) {
                        setOpenMobile(false);
                      }
                    }}
                    className="[&>svg]:size-6"
                  >
                    <HoverPrefetchLink href={`/r/${community.name}`}>
                      <CommunityImage icon={community.icon} size={32} />
                      <span>r/{community.name}</span>
                    </HoverPrefetchLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </AccordionContent>
      </AccordionItem>
    </SidebarGroup>
  );
}
