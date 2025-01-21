"use client";

import Link from "next/link";

import { Star } from "lucide-react";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { RouterOutput } from "@/trpc/routers/_app";
import type { ArrElement } from "@/types";
import { cn } from "@/utils/cn";
import CommunityImage from "../community/CommunityImage";
import { Button } from "../ui/button";

export default function SidebarNavItem({
  communityRelation,
  canFavorite,
}: {
  communityRelation: ArrElement<
    RouterOutput["community"]["getJoinedCommunities"]
  >;
  canFavorite: boolean;
}) {
  const utils = trpc.useUtils();

  const toggleFavorite = trpc.community.toggleFavoriteCommunity.useMutation({
    onMutate: (variables) => {
      const { communityId, favorited } = variables;

      utils.community.getModeratedCommunities.setData(undefined, (data) => {
        if (!data) {
          return [{ ...communityRelation, favorited }];
        }

        return data.map((userToCommunity) => {
          if (userToCommunity.community.id !== communityId)
            return userToCommunity;

          return { ...userToCommunity, favorited };
        });
      });

      utils.community.getJoinedCommunities.setData(undefined, (data) => {
        if (!data) {
          return [{ ...communityRelation, favorited }];
        }

        return data.map((userToCommunity) => {
          if (communityRelation.community.id !== communityId)
            return userToCommunity;

          return { ...userToCommunity, favorited };
        });
      });
    },
    onSuccess: () => {
      utils.community.getUserToCommunity.invalidate(
        communityRelation.community.name,
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <li key={communityRelation.community.id} className="flex">
      <Button
        variant="ghost"
        size="lg"
        className="w-full justify-start px-4 text-sm font-normal hover:bg-accent/40"
        asChild
      >
        <Link href={`/r/${communityRelation.community.name}`}>
          <CommunityImage icon={communityRelation.community.icon} size={32} />
          <h2 className="truncate">r/{communityRelation.community.name}</h2>
          {canFavorite && (
            <Star
              className={cn("ml-auto size-5 stroke-1", {
                "fill-foreground text-foreground": communityRelation.favorited,
              })}
              onClick={(e) => {
                e.preventDefault();

                toggleFavorite.mutate({
                  communityId: communityRelation.community.id,
                  favorited: !communityRelation.favorited,
                });
              }}
            />
          )}
        </Link>
      </Button>
    </li>
  );
}
