"use client";

import Link from "next/link";

import { Star } from "lucide-react";
import { toast } from "sonner";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
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

export default function SidebarNavJoined() {
  const [joinedCommunities] =
    trpc.community.getJoinedCommunities.useSuspenseQuery();

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

  const { setOpenMobile, isMobile } = useSidebar();

  if (joinedCommunities.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <AccordionItem value="joined">
        <SidebarGroupLabel asChild className="group/label">
          <AccordionTrigger>JOINED</AccordionTrigger>
        </SidebarGroupLabel>
        <AccordionContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {joinedCommunities
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
                      className="pr-8"
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
                    <SidebarMenuBadge
                      className="pointer-events-auto cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();

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
                        className={cn("ml-auto size-5 stroke-1", {
                          "fill-foreground text-foreground":
                            userToCommunity.favorited,
                        })}
                      />
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </AccordionContent>
      </AccordionItem>
    </SidebarGroup>
  );
}
