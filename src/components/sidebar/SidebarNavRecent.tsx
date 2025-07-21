"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import CommunityIcon from "../community/CommunityIcon";
import { HoverPrefetchLink } from "../ui/hover-prefetch-link";
import SidebarNavSkeleton from "./SidebarNavSkeleton";

export default function SidebarNavRecent() {
  const state = useRecentCommunityContext();

  const { isMobile, setOpenMobile } = useSidebar();

  if (state.isLoading) {
    return <SidebarNavSkeleton itemCount={4} canFavorite={false} />;
  }

  if (state.communities.length === 0) {
    return null;
  }

  return (
    <Collapsible
      title="Recently visited communities"
      defaultOpen
      className="group/collapsible"
    >
      <SidebarGroup>
        <SidebarGroupLabel
          asChild
          className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
        >
          <CollapsibleTrigger>
            Recent{" "}
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarGroupContent>
            <SidebarMenu>
              {state.communities.map((community) => (
                <SidebarMenuItem key={community.id}>
                  <SidebarMenuButton
                    onClick={() => {
                      if (isMobile) {
                        setOpenMobile(false);
                      }
                    }}
                    asChild
                  >
                    <HoverPrefetchLink href={`/r/${community.name}`}>
                      <CommunityIcon
                        icon={community.icon}
                        iconPlaceholder={community.iconPlaceholder}
                        communtiyName={community.name}
                        size={28}
                        className="aspect-square rounded-full object-cover select-none"
                      />
                      <span>r/{community.name}</span>
                    </HoverPrefetchLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
