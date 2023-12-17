"use client";

import type { MouseEvent } from "react";

import Image from "next/image";
import Link from "next/link";

import { StarIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import type {
  getFavoriteCommunities,
  getJoinedCommunities,
  getModeratedCommunities,
} from "@/lib/api/communities";
import cn from "@/lib/utils/cn";
import { trpc } from "@/trpc/react";
import type { ArrElement } from "@/types";

type Props = {
  communityRelation: ArrElement<
    Awaited<
      ReturnType<
        | typeof getFavoriteCommunities
        | typeof getModeratedCommunities
        | typeof getJoinedCommunities
      >
    >
  >;
};

export default function YourCommunitiesNavigation({
  communityRelation,
}: Props) {
  const utils = trpc.useUtils();

  const setFavorite = trpc.setFavoriteCommunity.useMutation({
    onError: async ({ message }) => {
      await Promise.all([
        utils.getFavoriteCommunities.refetch(),
        utils.getModeratedCommunities.refetch(),
        utils.getJoinedCommunities.refetch(),
      ]).catch(() => {
        throw new Error("Could not load users information.");
      });

      toast.error(message);
    },

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
  });

  const toggleFavorite = (
    e: MouseEvent<SVGSVGElement>,
    communityRelation: Props["communityRelation"],
  ) => {
    e.preventDefault();

    setFavorite.mutate({
      communityId: communityRelation.communityId,
      favorite: !communityRelation.favorite,
    });
  };

  return (
    <li key={communityRelation.communityId}>
      <Link
        href={`/r/${communityRelation.community.name}`}
        className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
      >
        {communityRelation.community.imageUrl ? (
          <Image
            src={communityRelation.community.imageUrl}
            alt="community image"
            width={20}
            height={20}
            className="rounded-full"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#0079D3"
            className="h-5 w-5 rounded-full border border-zinc-300 bg-zinc-300"
          >
            <path d="M16.5,2.924,11.264,15.551H9.91L15.461,2.139h.074a9.721,9.721,0,1,0,.967.785ZM8.475,8.435a1.635,1.635,0,0,0-.233.868v4.2H6.629V6.2H8.174v.93h.041a2.927,2.927,0,0,1,1.008-.745,3.384,3.384,0,0,1,1.453-.294,3.244,3.244,0,0,1,.7.068,1.931,1.931,0,0,1,.458.151l-.656,1.558a2.174,2.174,0,0,0-1.067-.246,2.159,2.159,0,0,0-.981.215A1.59,1.59,0,0,0,8.475,8.435Z" />
          </svg>
        )}

        <h2>r/{communityRelation.community.name}</h2>

        <StarIcon
          className={cn("ml-auto h-6 w-6", {
            "fill-[#0079d3] text-[#0079d3]": communityRelation.favorite,
            "text-zinc-500": communityRelation.favorite === false,
          })}
          onClick={(e) => toggleFavorite(e, communityRelation)}
        />
      </Link>
    </li>
  );
}
