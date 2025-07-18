"use client";

import Image from "next/image";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
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
import { cn } from "@/lib/cn";
import { useTRPC } from "@/trpc/client";
import defaultCommunityIcon from "@public/defaultCommunityIcon.png";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { HoverPrefetchLink } from "../ui/hover-prefetch-link";
import SidebarDialog from "./SidebarDialog";

export default function SidebarNavModerated() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { data: moderatedCommunities } = useSuspenseQuery(
    trpc.community.getModeratedCommunities.queryOptions(),
  );

  const moderatedCommunitiesQueryKey =
    trpc.community.getModeratedCommunities.queryKey();
  const joinedCommunitiesQueryKey =
    trpc.community.getJoinedCommunities.queryKey();

  const toggleFavorite = useMutation(
    trpc.community.toggleFavoriteCommunity.mutationOptions({
      onMutate: (variables) => {
        const { communityId, favorited } = variables;

        queryClient.setQueryData(moderatedCommunitiesQueryKey, (updater) => {
          if (!updater) {
            return [];
          }

          return updater.map((_userToCommunity) => {
            if (communityId !== _userToCommunity.community.id)
              return _userToCommunity;

            return { ..._userToCommunity, favorited };
          });
        });

        queryClient.setQueryData(joinedCommunitiesQueryKey, (updater) => {
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
    }),
  );

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
                  <SidebarMenuButton className="[&>svg]:size-6">
                    <Plus className="stroke-[1.5]" />
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
                        className="[&>svg]:size-6"
                      >
                        <HoverPrefetchLink
                          href={`/r/${userToCommunity.community.name}`}
                        >
                          <Image
                            src={
                              userToCommunity.community.icon ??
                              defaultCommunityIcon
                            }
                            alt={`${userToCommunity.community.name} community icon`}
                            width={32}
                            height={32}
                            className="rounded-full object-contain select-none"
                          />
                          <span>r/{userToCommunity.community.name}</span>
                        </HoverPrefetchLink>
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
                                queryClient.invalidateQueries({
                                  queryKey:
                                    trpc.community.getUserToCommunity.queryKey(
                                      userToCommunity.community.name,
                                    ),
                                });
                              },
                              onError: (error) => {
                                console.error(error);
                                toast.error(
                                  "Failed to favorite the community. Please try refreshing the page or try again later.",
                                );
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
