"use client";

import Link from "next/link";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Star } from "lucide-react";
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
import { useTRPC } from "@/trpc/client";
import { cn } from "@/utils/cn";
import CommunityImage from "../community/CommunityImage";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function SidebarNavJoined() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { data: joinedCommunities } = useSuspenseQuery(
    trpc.community.getJoinedCommunities.queryOptions(),
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
                              const userToCommunityQueryKey =
                                trpc.community.getUserToCommunity.queryKey(
                                  userToCommunity.community.name,
                                );

                              queryClient.invalidateQueries({
                                queryKey: userToCommunityQueryKey,
                              });
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
