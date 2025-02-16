"use client";

import Link from "next/link";

import { CakeSlice, Globe, Info } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Community } from "@/db/schema/communities";
import { trpc } from "@/trpc/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function CommunitySidebar({
  communityName,
  isDialog,
}: {
  communityName: Community["name"];
  isDialog?: boolean;
}) {
  if (isDialog) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-full text-muted-foreground xl:hidden"
          >
            <Info className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto bg-card">
          <DialogHeader className="sr-only">
            <DialogTitle>Community Information</DialogTitle>
            <DialogDescription>
              This dialog displays details about the community. Please review
              the information provided.
            </DialogDescription>
          </DialogHeader>
          <CommunitySidebarContent communityName={communityName} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="sticky top-[72px] hidden h-fit w-80 flex-col gap-2.5 rounded-lg border bg-card px-3 py-2 xl:flex">
      <CommunitySidebarContent communityName={communityName} />
    </div>
  );
}

function CommunitySidebarContent({
  communityName,
}: {
  communityName: Community["name"];
}) {
  const [community] =
    trpc.community.getCommunityByName.useSuspenseQuery(communityName);

  return (
    <>
      <h2 className="break-words text-lg font-bold tracking-wide">
        r/{community.name}
      </h2>

      <div className="text-sm">
        {community.displayName && (
          <h3 className="break-words font-bold">{community.displayName}</h3>
        )}
        {community.description && (
          <p className="break-words text-muted-foreground">
            {community.description}
          </p>
        )}
      </div>

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
            {community.memberNickname || "Memebers"}
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
            New {community.memberNickname || "memebers"}
          </div>
        </div>
        <div />
      </div>

      <Separator />

      <div className="flex flex-col items-start gap-1">
        <div className="text-sm uppercase text-muted-foreground">Moderator</div>
        <Link
          href={`/u/${community.moderator.username}`}
          className="inline-flex w-full items-center gap-2"
        >
          <Avatar className="size-8">
            <AvatarImage src={community.moderator.imageUrl} />
            <AvatarFallback className="uppercase">
              {community.moderator.username?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-sm">
            u/{community.moderator.username}
          </span>
        </Link>
      </div>
    </>
  );
}
