"use client";

import { Suspense, useEffect } from "react";
import Image from "next/image";

import { useClerk } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";

import {
  ReducerAction,
  useRecentCommunityDispatchContext,
} from "@/context/RecentCommunityContext";
import useHydration from "@/hooks/useHydration";
import { trpc } from "@/trpc/client";
import communityBanner from "@public/communityBanner.jpg";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import CommunityDeleteDialog from "./CommunityDeleteDialog";
import CommunityEditDialog from "./CommunityEditDialog";
import CommunityHeaderDropdown from "./CommunityHeaderDropdown";
import CommunityImage from "./CommunityImage";
import CommunitySidebar from "./CommunitySidebar";

export default function CommunityHeader({
  currentUserId,
  communityName,
}: {
  currentUserId: User["id"] | null;
  communityName: string;
}) {
  const [community] =
    trpc.community.getCommunityByName.useSuspenseQuery(communityName);

  const dispatch = useRecentCommunityDispatchContext();

  const clerk = useClerk();
  const isHydrated = useHydration();

  useEffect(() => {
    if (!isHydrated) return;

    dispatch({
      type: ReducerAction.ADD_COMMUNITY,
      community: {
        id: community.id,
        name: community.name,
        icon: community.icon,
      },
    });
  }, [dispatch, community.icon, community.id, community.name, isHydrated]);

  return (
    <div className="flex flex-col rounded-lg border bg-card">
      <Image
        src={communityBanner}
        alt="shrek themed community banner"
        className="h-20 w-full rounded-t-lg object-cover lg:h-32"
        placeholder="blur"
      />

      <div className="flex flex-col justify-between gap-4 px-4 py-2.5 md:flex-row md:items-center">
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

              <CommunitySidebar communityName={communityName} isDialog />
            </div>
            <div className="flex gap-1 text-xs text-muted-foreground lg:hidden">
              <span>
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(community.memberCount)}{" "}
                {community.memberNickname || "members"}
              </span>
              <span>•</span>
              <div>
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(community.newMemberCount)}{" "}
                new {community.memberNickname || "members"}
              </div>
            </div>
          </div>
        </div>

        {!currentUserId && (
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
        )}

        {currentUserId && (
          <Suspense
            fallback={
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-32 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="size-9 rounded-full" />
              </div>
            }
          >
            <CommunityHeaderDropdown
              communityId={community.id}
              communityName={communityName}
              isCommunityModerator={currentUserId === community.moderatorId}
            >
              <CommunityEditDialog community={community} />
              <CommunityDeleteDialog communityId={community.id} />
            </CommunityHeaderDropdown>
          </Suspense>
        )}
      </div>
    </div>
  );
}
