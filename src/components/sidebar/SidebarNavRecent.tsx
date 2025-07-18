"use client";

import Image from "next/image";

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
import defaultCommunityIcon from "@public/defaultCommunityIcon.png";
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
                      <Image
                        src={community.icon ?? defaultCommunityIcon}
                        alt={`${community.name} community icon`}
                        width={32}
                        height={32}
                        className="rounded-full object-contain select-none"
                      />
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
