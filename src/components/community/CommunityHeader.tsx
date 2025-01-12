"use client";

import { useEffect } from "react";
import Image from "next/image";

import { Ellipsis } from "lucide-react";

import {
  ReducerAction,
  useRecentCommunityDispatchContext,
} from "@/context/RecentCommunityContext";
import { trpc } from "@/trpc/client";
import communityBanner from "@public/communityBanner.jpg";
import { Button } from "../ui/button";
import CommunityImage from "./CommunityImage";

export default function CommunityHeader({
  communityName,
}: {
  communityName: string;
}) {
  const dispatch = useRecentCommunityDispatchContext();

  const [community] =
    trpc.community.getCommunityByName.useSuspenseQuery(communityName);

  if (!community) {
    throw new Error("Community not found");
  }

  useEffect(() => {
    dispatch({
      type: ReducerAction.ADD_COMMUNITY,
      community: {
        id: community.id,
        name: community.name,
        icon: community.icon,
      },
    });
  }, [dispatch, community.icon, community.id, community.name]);

  return (
    <div className="flex flex-col rounded-lg border bg-card">
      <Image
        src={communityBanner}
        alt="shrek themed community banner"
        className="h-20 w-full rounded-lg object-cover md:h-32"
        placeholder="blur"
      />

      <div className="flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex h-12 gap-2">
          <CommunityImage
            icon={community.icon}
            size={56}
            className="size-[88px] self-end border-2 border-card bg-card md:border-4"
          />
          <h1 className="self-center break-all text-lg font-extrabold md:text-3xl">
            r/{community.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button className="h-10 rounded-full font-bold">Join</Button>

          <Button variant="ghost" className="h-10 w-10 rounded-full">
            <Ellipsis className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
