"use client";

import { onion } from "@lucide/lab";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Cake, Icon, Info } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTRPC } from "@/trpc/client";
import defaultUserImage from "@public/defaultUserImage.png";
import CommunityImage from "../community/CommunityImage";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { HoverPrefetchLink } from "../ui/hover-prefetch-link";
import { Separator } from "../ui/separator";

export default function UserSidebar({
  username,
  isDialog,
}: {
  username: string;
  isDialog?: boolean;
}) {
  if (isDialog) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-7 min-w-7 rounded-full xl:hidden"
          >
            <Info className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card max-h-screen overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Community Information</DialogTitle>
            <DialogDescription>
              This dialog displays details about the community. Please review
              the information provided.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2.5">
            <UserSidebarContent username={username} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="bg-card sticky top-[72px] hidden h-fit w-80 flex-col gap-2.5 rounded-lg border px-3 py-2 xl:flex">
      <UserSidebarContent username={username} />
    </div>
  );
}

function UserSidebarContent({ username }: { username: string }) {
  const trpc = useTRPC();

  const { data: user } = useSuspenseQuery(
    trpc.user.getUserByName.queryOptions(username),
  );

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Avatar>
          <AvatarImage src={user.image ?? defaultUserImage.src} />
          <AvatarFallback className="uppercase">
            {username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="leading-tight font-bold break-words">{user.name}</div>
          <div className="text-muted-foreground flex gap-1 text-xs break-words">
            u/{username}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="space-y-1">
          <div className="text-muted-foreground text-xs">Onions</div>
          <div className="flex items-center gap-1">
            <Icon iconNode={onion} className="size-4" />
            <div className="text-xs text-zinc-500">
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(user.onionCount)}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-muted-foreground text-xs">Onion day</div>
          <div className="flex items-center gap-1">
            <Cake className="size-4" />
            <div className="text-xs text-zinc-500">
              {user.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </div>
          </div>
        </div>
        <div />
      </div>

      {user.communities.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-2">
            <h1 className="text-muted-foreground text-sm uppercase">
              Moderator of these communities
            </h1>
            <div
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "hsl(var(--muted-foreground)/0.4) transparent",
              }}
              className="flex max-h-56 flex-col gap-3.5 overflow-y-auto"
            >
              {user.communities.map((community) => (
                <div key={community.id} className="flex items-center gap-1.5">
                  <CommunityImage icon={community.icon} size={32} />

                  <div className="truncate text-xs tracking-wide">
                    <HoverPrefetchLink
                      href={`/r/${community.name}`}
                      className="max-w-[15rem] cursor-pointer font-medium lowercase hover:underline"
                    >
                      r/{community.name}
                    </HoverPrefetchLink>
                    <div>
                      {new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(community.memberCount)}{" "}
                      {community.memberCount === 1 ? "member" : "members"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
