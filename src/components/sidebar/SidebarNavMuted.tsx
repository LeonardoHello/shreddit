"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTRPC } from "@/trpc/client";
import CommunityIcon from "../community/CommunityIcon";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { HoverPrefetchLink } from "../ui/hover-prefetch-link";

export default function SidebarNavMuted() {
  const { isMobile, setOpenMobile } = useSidebar();

  const trpc = useTRPC();

  const { data: mutedCommunities } = useSuspenseQuery(
    trpc.community.getMutedCommunities.queryOptions(),
  );

  if (mutedCommunities.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <AccordionItem value="muted">
        <SidebarGroupLabel asChild className="group/label">
          <AccordionTrigger>MUTED</AccordionTrigger>
        </SidebarGroupLabel>
        <AccordionContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {mutedCommunities
                .sort((a, b) => {
                  if (a.community.name < b.community.name) return -1;
                  if (a.community.name > b.community.name) return 1;
                  return 0;
                })
                .map((userToCommunity) => (
                  <SidebarMenuItem key={userToCommunity.community.id}>
                    <SidebarMenuButton
                      asChild
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                      className="[&>svg]:size-6"
                    >
                      <HoverPrefetchLink
                        href={`/r/${userToCommunity.community.name}`}
                      >
                        <CommunityIcon
                          icon={userToCommunity.community.icon}
                          iconPlaceholder={
                            userToCommunity.community.iconPlaceholder
                          }
                          communtiyName={userToCommunity.community.name}
                          size={32}
                          className="aspect-square rounded-full object-cover select-none"
                        />
                        <span>r/{userToCommunity.community.name}</span>
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
