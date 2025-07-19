"use client";

import { Suspense, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import * as thumbhash from "thumbhash";

import {
  ReducerAction,
  useRecentCommunityDispatchContext,
} from "@/context/RecentCommunityContext";
import { User } from "@/db/schema/users";
import useHydration from "@/hooks/useHydration";
import { useTRPC } from "@/trpc/client";
import defaultCommunityBanner from "@public/defaultCommunityBanner.jpg";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import CommunityDeleteDialog from "./CommunityDeleteDialog";
import CommunityEditDialog from "./CommunityEditDialog";
import CommunityHeaderDropdown from "./CommunityHeaderDropdown";
import CommunityIcon from "./CommunityIcon";
import CommunitySidebar from "./CommunitySidebar";

export default function CommunityHeader({
  currentUserId,
  communityName,
}: {
  currentUserId: User["id"] | null;
  communityName: string;
}) {
  const trpc = useTRPC();

  const { data: community } = useSuspenseQuery(
    trpc.community.getCommunityByName.queryOptions(communityName),
  );

  if (!community) {
    notFound();
  }

  const dispatch = useRecentCommunityDispatchContext();

  const isHydrated = useHydration();

  useEffect(() => {
    if (!isHydrated) return;

    dispatch({
      type: ReducerAction.ADD_COMMUNITY,
      community: {
        id: community.id,
        name: community.name,
        icon: community.icon,
        iconPlaceholder: community.iconPlaceholder,
      },
    });
  }, [
    dispatch,
    community.id,
    community.name,
    community.icon,
    community.iconPlaceholder,
    isHydrated,
  ]);

  const placeholderURL =
    community.bannerPlaceholder &&
    thumbhash.thumbHashToDataURL(
      Buffer.from(community.bannerPlaceholder, "base64"),
    );

  return (
    <div className="bg-card flex flex-col rounded-lg border">
      <div className="relative aspect-8/1">
        <Image
          src={community.banner ?? defaultCommunityBanner}
          alt={`${community.name} community icon`}
          fill
          placeholder="blur"
          blurDataURL={
            community.banner && placeholderURL ? placeholderURL : undefined
          }
          className="w-auto rounded-t-lg object-cover"
        />
      </div>

      <div className="flex flex-col justify-between gap-4 px-4 py-2.5 md:flex-row md:items-center">
        <div className="flex items-center gap-2 lg:max-h-10">
          <CommunityIcon
            icon={community.icon}
            iconPlaceholder={community.iconPlaceholder}
            communtiyName={community.name}
            size={48}
            className="border-card bg-card z-10 aspect-square rounded-full border-2 object-cover select-none lg:size-24 lg:self-end lg:border-4"
          />
          <div>
            <div className="flex items-center gap-1">
              <h1 className="self-center text-lg font-extrabold break-all xl:text-3xl">
                r/{community.name}
              </h1>

              <CommunitySidebar communityName={communityName} isDialog />
            </div>
            <div className="text-muted-foreground flex gap-1 text-xs xl:hidden">
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
            <Button variant={"outline"} className="rounded-full" asChild>
              <Link href={"/sign-in"}>
                <Plus className="stroke-[1.5]" viewBox="4 4 16 16" />
                <span className="capitalize">create post</span>
              </Link>
            </Button>

            <Button className="rounded-full capitalize" asChild>
              <Link href={"/sign-in"}>join</Link>
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
