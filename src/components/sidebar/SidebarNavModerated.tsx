"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ChevronRight, Plus, Star } from "lucide-react";
import { toast } from "sonner";

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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/cn";
import { useTRPC } from "@/trpc/client";
import sortSidebarCommunities from "@/utils/sortSidebarCommunities";
import CommunityIcon from "../community/CommunityIcon";
import { HoverPrefetchLink } from "../ui/hover-prefetch-link";
import SidebarDialog from "./SidebarDialog";

export default function SidebarNavModerated() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: moderatedCommunities } = useSuspenseQuery(
    trpc.community.getModeratedCommunities.queryOptions(),
  );

  const moderatedCommunitiesQueryKey =
    trpc.community.getModeratedCommunities.queryKey();
  const joinedCommunitiesQueryKey =
    trpc.community.getJoinedCommunities.queryKey();
  const mutedCommunitiesQueryKey =
    trpc.community.getMutedCommunities.queryKey();

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

            return { ..._userToCommunity, favorited, favoritedAt: new Date() };
          });
        });

        queryClient.setQueryData(joinedCommunitiesQueryKey, (updater) => {
          if (!updater) {
            return [];
          }

          return updater.map((_userToCommunity) => {
            if (communityId !== _userToCommunity.community.id)
              return _userToCommunity;

            return { ..._userToCommunity, favorited, favoritedAt: new Date() };
          });
        });

        queryClient.setQueryData(mutedCommunitiesQueryKey, (updater) => {
          if (!updater) {
            return [];
          }

          return updater.map((_userToCommunity) => {
            if (communityId !== _userToCommunity.community.id)
              return _userToCommunity;

            return { ..._userToCommunity, favorited, favoritedAt: new Date() };
          });
        });
      },
      onError: (error) => {
        queryClient.invalidateQueries({
          queryKey: moderatedCommunitiesQueryKey,
        });
        queryClient.invalidateQueries({ queryKey: joinedCommunitiesQueryKey });
        queryClient.invalidateQueries({ queryKey: mutedCommunitiesQueryKey });

        console.error(error);
        toast.error(
          "Failed to toggle favorite community. Please try again later.",
        );
      },
    }),
  );

  const { isMobile, setOpenMobile } = useSidebar();

  const sortedSidebarCommunities = sortSidebarCommunities(moderatedCommunities);

  return (
    <Collapsible
      title="Communities you created"
      defaultOpen
      className="group/collapsible"
    >
      <SidebarGroup>
        <SidebarGroupLabel
          asChild
          className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm font-light uppercase"
        >
          <CollapsibleTrigger>
            Moderated{" "}
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarDialog>
                <SidebarMenuItem>
                  <SidebarMenuButton className="[&>svg]:size-7">
                    <Plus className="stroke-[1.25]" />
                    Create Community
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarDialog>

              {sortedSidebarCommunities.map((item) => (
                <SidebarMenuItem key={item.community.id}>
                  <SidebarMenuButton
                    onClick={() => {
                      if (isMobile) {
                        setOpenMobile(false);
                      }
                    }}
                    asChild
                  >
                    <HoverPrefetchLink href={`/r/${item.community.name}`}>
                      <CommunityIcon
                        icon={item.community.icon}
                        iconPlaceholder={item.community.iconPlaceholder}
                        communtiyName={item.community.name}
                        size={28}
                        className="aspect-square rounded-full object-cover select-none"
                      />
                      <span>r/{item.community.name}</span>
                    </HoverPrefetchLink>
                  </SidebarMenuButton>
                  <SidebarMenuAction
                    onClick={() => {
                      toggleFavorite.mutate(
                        {
                          communityId: item.community.id,
                          favorited: !item.favorited,
                        },
                        {
                          onSuccess: () => {
                            queryClient.invalidateQueries({
                              queryKey:
                                trpc.community.getUserToCommunity.queryKey(
                                  item.community.name,
                                ),
                            });
                          },
                          onError: (error) => {
                            console.error(error);
                            toast.error(
                              "Failed to favorite the community. Please try again later.",
                            );
                          },
                        },
                      );
                    }}
                  >
                    <Star
                      className={cn({
                        "fill-foreground text-foreground": item.favorited,
                      })}
                    />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
