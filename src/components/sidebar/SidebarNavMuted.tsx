"use client";

import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { trpc } from "@/trpc/client";
import CommunityImage from "../community/CommunityImage";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function SidebarNavMuted() {
  const [mutedCommunities] =
    trpc.community.getMutedCommunities.useSuspenseQuery();

  const { isMobile, setOpenMobile } = useSidebar();

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
                    >
                      <Link href={`/r/${userToCommunity.community.name}`}>
                        <CommunityImage
                          icon={userToCommunity.community.icon}
                          size={32}
                        />
                        <span>r/{userToCommunity.community.name}</span>
                      </Link>
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
