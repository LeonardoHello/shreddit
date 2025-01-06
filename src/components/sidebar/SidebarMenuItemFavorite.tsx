"use client";

import Link from "next/link";

import { StarIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { RouterOutput } from "@/trpc/routers/_app";
import type { ArrElement } from "@/types";
import { cn } from "@/utils/cn";
import CommunityImage from "../community/CommunityImage";
import { Button } from "../ui/button";

export default function SidebarMenuItemFavorite({
  communityRelation,
}: {
  communityRelation: ArrElement<
    RouterOutput["community"]["getJoinedCommunities"]
  >;
}) {
  const utils = trpc.useUtils();

  const setFavorite = trpc.community.setFavoriteCommunity.useMutation({
    onMutate: (variables) => {
      const { communityId, favorite } = variables;

      utils.community.getModeratedCommunities.setData(undefined, (data) => {
        if (!data) {
          return [];
        }

        return data.map((userToCommunity) => {
          if (userToCommunity.communityId !== communityId)
            return userToCommunity;

          return { ...userToCommunity, favorite };
        });
      });

      utils.community.getJoinedCommunities.setData(undefined, (data) => {
        if (!data) {
          return [];
        }

        return data.map((userToCommunity) => {
          if (userToCommunity.communityId !== communityId)
            return userToCommunity;

          return { ...userToCommunity, favorite };
        });
      });
    },
    onError: async (error) => {
      toast.error(error.message);
    },
  });

  return (
    <li key={communityRelation.communityId} className="flex">
      <Button
        variant="ghost"
        size="lg"
        className="w-full px-4 text-sm font-normal tracking-wide hover:bg-accent/40"
        asChild
      >
        <Link href={`/r/${communityRelation.community.name}`}>
          <CommunityImage
            imageUrl={communityRelation.community.imageUrl}
            size={32}
            className="border-2"
          />
          <h2 className="truncate">r/{communityRelation.community.name}</h2>
          <StarIcon
            className={cn("ml-auto size-6 text-muted-foreground", {
              "fill-[#0079d3] text-[#0079d3]": communityRelation.favorite,
            })}
            onClick={(e) => {
              e.preventDefault();

              setFavorite.mutate({
                communityId: communityRelation.communityId,
                favorite: !communityRelation.favorite,
              });
            }}
          />
        </Link>
      </Button>
    </li>
  );
}
