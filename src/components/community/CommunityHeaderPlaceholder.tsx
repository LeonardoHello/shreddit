"use client";

import { useEffect } from "react";
import Image from "next/image";

import { useClerk } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import {
  ReducerAction,
  useRecentCommunityDispatchContext,
} from "@/context/RecentCommunityContext";
import { trpc } from "@/trpc/client";
import communityBanner from "@public/communityBanner.jpg";
import { Button } from "../ui/button";
import CommunityHeaderDialog from "./CommunityHeaderDialog";
import CommunityImage from "./CommunityImage";

export default function CommunityHeaderPlaceholder({
  communityName,
}: {
  communityName: string;
}) {
  const dispatch = useRecentCommunityDispatchContext();

  const clerk = useClerk();

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
        className="h-20 w-full rounded-t-lg object-cover lg:h-32"
        placeholder="blur"
      />

      <div className="flex flex-col justify-between gap-4 px-4 py-2.5 md:flex-row md:items-center lg:gap-4">
        <div className="flex items-center gap-2 lg:max-h-10">
          <CommunityImage
            icon={community.icon}
            size={56}
            className="size-12 border-card bg-card lg:size-24 lg:self-end lg:border-4"
          />
          <div>
            <div className="flex items-center gap-1">
              <h1 className="self-center break-all text-lg font-extrabold lg:text-3xl">
                r/{community.name}
              </h1>

              <CommunityHeaderDialog communityName={communityName} />
            </div>
            <div className="flex gap-1 text-xs text-muted-foreground lg:hidden">
              <span>
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(community.memberCount)}{" "}
                {community.memberCount == 1 ? "member" : "members"}
              </span>
              <span>•</span>
              <div>
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(community.newMemberCount)}{" "}
                {community.newMemberCount == 1 ? "new member" : "new members"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={"outline"}
            className="rounded-full"
            onClick={() => {
              clerk.openSignIn();
            }}
          >
            <Plus className="size-5 stroke-1" viewBox="4 4 16 16" />
            <span className="capitalize">create post</span>
          </Button>

          <Button
            className="rounded-full font-bold capitalize"
            onClick={() => {
              clerk.openSignIn();
            }}
          >
            join
          </Button>
        </div>
      </div>
    </div>
  );
}
