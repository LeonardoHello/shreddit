"use client";

import Link from "next/link";

import { StarIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { RouterOutput } from "@/trpc/routers/_app";
import type { ArrElement } from "@/types";
import { cn } from "@/utils/cn";
import CommunityImage from "../community/CommunityImage";

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
    <li key={communityRelation.communityId}>
      <Link
        href={`/r/${communityRelation.community.name}`}
        className="flex h-10 items-center gap-2 rounded-md px-4 text-sm hover:bg-zinc-700/30"
      >
        <CommunityImage
          imageUrl={communityRelation.community.imageUrl}
          size={32}
          className="border-2"
        />
        <h2 className="truncate">r/{communityRelation.community.name}</h2>
        <StarIcon
          className={cn("ml-auto h-6 w-6 min-w-[1.5rem]", {
            "fill-[#0079d3] text-[#0079d3]": communityRelation.favorite,
            "text-zinc-500": communityRelation.favorite === false,
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
    </li>
  );
}
