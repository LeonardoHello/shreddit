"use client";

import Link from "next/link";

import { StarIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { RouterOutput } from "@/trpc/procedures";
import { trpc } from "@/trpc/react";
import type { ArrElement } from "@/types";
import cn from "@/utils/cn";
import CommunityImage from "../community/CommunityImage";

type CommunityRelation = ArrElement<
  RouterOutput[
    | "getFavoriteCommunities"
    | "getModeratedCommunities"
    | "getJoinedCommunities"]
>;

export default function MenuCommunitiesNavigation({
  communityRelation,
}: {
  communityRelation: CommunityRelation;
}) {
  const utils = trpc.useUtils();

  const setFavorite = trpc.setFavoriteCommunity.useMutation({
    onMutate: (variables) => {
      const { communityId, favorite } = variables;

      utils.getFavoriteCommunities.setData(undefined, (data) => {
        if (!data) {
          toast.error("Oops, something went wrong.");
          return [];
        }

        if (favorite) {
          return [...data, { ...communityRelation, favorite }];
        } else {
          return data.filter(
            (userToCommunity) => userToCommunity.communityId !== communityId,
          );
        }
      });

      utils.getModeratedCommunities.setData(undefined, (data) => {
        if (!data) {
          toast.error("Oops, something went wrong.");
          return [];
        }

        return data.map((userToCommunity) => {
          if (userToCommunity.communityId !== communityId)
            return userToCommunity;

          return { ...userToCommunity, favorite };
        });
      });

      utils.getJoinedCommunities.setData(undefined, (data) => {
        if (!data) {
          toast.error("Oops, something went wrong.");
          return [];
        }

        return data.map((userToCommunity) => {
          if (userToCommunity.communityId !== communityId)
            return userToCommunity;

          return { ...userToCommunity, favorite };
        });
      });
    },
    onError: async ({ message }) => {
      await Promise.all([
        utils.getFavoriteCommunities.refetch(),
        utils.getModeratedCommunities.refetch(),
        utils.getJoinedCommunities.refetch(),
      ]).catch(() => {
        throw new Error("Could not load menu information.");
      });

      toast.error(message);
    },
  });

  return (
    <li key={communityRelation.communityId}>
      <Link
        href={`/r/${communityRelation.community.name}`}
        className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
      >
        <CommunityImage
          imageUrl={communityRelation.community.imageUrl}
          size={20}
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
