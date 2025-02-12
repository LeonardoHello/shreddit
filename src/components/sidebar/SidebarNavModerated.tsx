"use client";

import Link from "next/link";

import { Plus, Star } from "lucide-react";
import { toast } from "sonner";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { trpc } from "@/trpc/client";
import { cn } from "@/utils/cn";
import CommunityImage from "../community/CommunityImage";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import SidebarDialog from "./SidebarDialog";

export default function SidebarNavModerated() {
  const [moderatedCommunities] =
    trpc.community.getModeratedCommunities.useSuspenseQuery();

  const utils = trpc.useUtils();

  const toggleFavorite = trpc.community.toggleFavoriteCommunity.useMutation({
    onMutate: (variables) => {
      const { communityId, favorited } = variables;

      utils.community.getModeratedCommunities.setData(undefined, (updater) => {
        if (!updater) {
          return [];
        }

        return updater.map((_userToCommunity) => {
          if (communityId !== _userToCommunity.community.id)
            return _userToCommunity;

          return { ..._userToCommunity, favorited };
        });
      });

      utils.community.getJoinedCommunities.setData(undefined, (updater) => {
        if (!updater) {
          return [];
        }

        return updater.map((_userToCommunity) => {
          if (communityId !== _userToCommunity.community.id)
            return _userToCommunity;

          return { ..._userToCommunity, favorited };
        });
      });
    },
  });

  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <AccordionItem value="moderated">
        <SidebarGroupLabel asChild className="group/label">
          <AccordionTrigger>MODERATED</AccordionTrigger>
        </SidebarGroupLabel>
        <AccordionContent>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarDialog>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Plus className="size-8 stroke-1" />
                    Create Community
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarDialog>

              {moderatedCommunities.length > 0 &&
                moderatedCommunities
                  .sort((a, b) => {
                    if (a.favorited && !b.favorited) return -1;
                    if (!a.favorited && b.favorited) return 1;
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
                      <SidebarMenuAction
                        onClick={() => {
                          toggleFavorite.mutate(
                            {
                              communityId: userToCommunity.community.id,
                              favorited: !userToCommunity.favorited,
                            },
                            {
                              onSuccess: () => {
                                utils.community.getUserToCommunity.invalidate(
                                  userToCommunity.community.name,
                                );
                              },
                              onError: (error) => {
                                toast.error(error.message);
                              },
                            },
                          );
                        }}
                      >
                        <Star
                          className={cn("stroke-1", {
                            "fill-foreground text-foreground":
                              userToCommunity.favorited,
                          })}
                        />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </AccordionContent>
      </AccordionItem>
    </SidebarGroup>
  );
}
