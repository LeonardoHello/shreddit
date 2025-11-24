"use client";

import { useMutation } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { ChevronRight, Star, type LucideIcon } from "lucide-react";
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
import { Community } from "@/db/schema/communities";
import { client } from "@/hono/client";
import { cn } from "@/lib/cn";
import { getQueryClient } from "@/tanstack-query/getQueryClient";
import { uuidv4PathRegex as reg } from "@/utils/hono";
import sortSidebarCommunities from "@/utils/sortSidebarCommunities";
import CommunityIcon from "../community/CommunityIcon";
import { HoverPrefetchLink } from "../ui/hover-prefetch-link";

type ModeratedCommunitiesType = InferResponseType<
  typeof client.users.me.communities.moderated.$get,
  200
>;
type JoinedCommunitiesType = InferResponseType<
  typeof client.users.me.communities.joined.$get,
  200
>;
type MutedCommunitiesType = InferResponseType<
  typeof client.users.me.communities.muted.$get,
  200
>;

export default function SidebarCollapsible({
  communities,
  defaultOpen = true,
  title,
  label,
  empty,
}: {
  communities:
    | ModeratedCommunitiesType
    | JoinedCommunitiesType
    | MutedCommunitiesType;
  defaultOpen?: boolean | undefined;
  title: string;
  label: string;
  empty: {
    icon: LucideIcon;
    title: string;
    description: string;
  };
}) {
  const queryClient = getQueryClient();

  const newDate = new Date().toISOString();

  const toggleFavorite = useMutation({
    mutationFn: async ({
      communityId,
      favorited,
    }: {
      communityId: Community["id"];
      favorited: boolean;
    }) => {
      const res = await client.users.me.communities[
        `:communityId{${reg}}`
      ].favorite.$patch({
        param: { communityId },
        json: { favorited },
      });

      return res.json();
    },
    onMutate: (variables) => {
      const { communityId, favorited } = variables;

      queryClient.setQueryData<ModeratedCommunitiesType>(
        ["users", "me", "communities", "moderated"],
        (updater) => {
          if (!updater) {
            return [];
          }

          return updater.map((_userToCommunity) => {
            if (communityId !== _userToCommunity.community.id)
              return _userToCommunity;

            return { ..._userToCommunity, favorited, favoritedAt: newDate };
          });
        },
      );

      queryClient.setQueryData<JoinedCommunitiesType>(
        ["users", "me", "communities", "joined"],
        (updater) => {
          if (!updater) {
            return [];
          }

          return updater.map((_userToCommunity) => {
            if (communityId !== _userToCommunity.community.id)
              return _userToCommunity;

            return { ..._userToCommunity, favorited, favoritedAt: newDate };
          });
        },
      );

      queryClient.setQueryData<MutedCommunitiesType>(
        ["users", "me", "communities", "muted"],
        (updater) => {
          if (!updater) {
            return [];
          }

          return updater.map((_userToCommunity) => {
            if (communityId !== _userToCommunity.community.id)
              return _userToCommunity;

            return { ..._userToCommunity, favorited, favoritedAt: newDate };
          });
        },
      );
    },
    onError: (error) => {
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "communities", "moderated"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "communities", "joined"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", "me", "communities", "muted"],
      });

      console.error(error);
      toast.error(
        "Failed to toggle favorite community. Please try again later.",
      );
    },
  });

  const { isMobile, setOpenMobile } = useSidebar();

  const sortedSidebarCommunities = sortSidebarCommunities(communities);

  return (
    <Collapsible
      title={title}
      defaultOpen={defaultOpen}
      className="group/collapsible"
    >
      <SidebarGroup>
        <SidebarGroupLabel
          asChild
          className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm font-light uppercase"
        >
          <CollapsibleTrigger>
            {label}{" "}
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarGroupContent>
            <SidebarMenu>
              {sortedSidebarCommunities.length === 0 && (
                <SidebarMenuItem>
                  <div
                    className={
                      "flex flex-col items-center justify-center px-4 py-6 text-center"
                    }
                  >
                    <empty.icon className="text-muted-foreground/50 mb-3 size-8" />
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      {empty.title}
                    </p>
                    <p className="text-muted-foreground/70 text-xs">
                      {empty.description}
                    </p>
                  </div>
                </SidebarMenuItem>
              )}
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
                              queryKey: [
                                "communities",
                                item.community.name,
                                "user",
                              ],
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
