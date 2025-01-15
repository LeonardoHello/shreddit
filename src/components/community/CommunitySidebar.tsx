"use client";

import Link from "next/link";

import { CakeSlice, Globe } from "lucide-react";

import { Community, User } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import CommunityDialog from "./CommunityDialog";

export default function CommunitySidebar({
  currentUserId,
  communityName,
}: {
  currentUserId: User["id"] | null;
  communityName: Community["name"];
}) {
  const [community] =
    trpc.community.getCommunityByName.useSuspenseQuery(communityName);

  if (!community) {
    throw new Error("Community not found");
  }

  return (
    <div className="sticky top-16 z-10 hidden h-fit w-80 flex-col gap-2 rounded border bg-card px-3 py-2 lg:flex">
      <div className="flex items-center justify-between gap-2">
        <h2 className="truncate font-medium tracking-wide">
          {community.displayName ?? community.name}
        </h2>
        {currentUserId === community.moderatorId && (
          <CommunityDialog communityId={community.id} />
        )}
      </div>

      {community.description && (
        <p className="max-w-[302px] break-words text-sm">
          {community.description}
        </p>
      )}

      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <CakeSlice className="size-4" />
          <p>
            Created{" "}
            {community.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="size-4" />
          <p>Public</p>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div
            title={`${community.memberCount} members`}
            className="text-sm font-bold"
          >
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(community.memberCount)}
          </div>
          <div className="text-xs text-muted-foreground">
            {community.memberNickname ?? "Memebers"}
          </div>
        </div>

        <div className="flex flex-col">
          <div
            title={`${community.newMemberCount} new members`}
            className="text-sm font-bold"
          >
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(community.newMemberCount)}
          </div>
          <div className="text-xs text-muted-foreground">
            New {community.memberNickname ?? "Memebers"}
          </div>
        </div>
        <div />
      </div>

      <Separator />

      <div className="flex flex-col items-start gap-1">
        <div className="text-sm uppercase text-muted-foreground">Moderator</div>
        <Link
          href={`/u/${community.moderator.username}`}
          className="flex items-center gap-2"
        >
          <Avatar className="size-8">
            <AvatarImage src={community.moderator.imageUrl} />
            <AvatarFallback className="uppercase">
              {community.moderator.username?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">u/{community.moderator.username}</span>
        </Link>
      </div>

      <Separator />

      <Button className="rounded-full font-bold" asChild>
        <Link href={`/r/${community.name}/submit`}>Create Post</Link>
      </Button>
    </div>
  );
}
