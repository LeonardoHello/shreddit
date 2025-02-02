import Link from "next/link";

import { onion } from "@lucide/lab";
import { Cake, Icon } from "lucide-react";

import { RouterOutput } from "@/trpc/routers/_app";
import getOnions from "@/utils/calculateOnions";
import { cn } from "@/utils/cn";
import CommunityImage from "../community/CommunityImage";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export default function UserSidebar({
  user,
  isDialog,
}: {
  user: NonNullable<RouterOutput["user"]["getUserByName"]>;
  isDialog?: boolean;
}) {
  return (
    <div
      className={cn("flex flex-col gap-2.5", {
        "sticky top-16 z-10 hidden h-fit w-80 rounded border bg-card px-3 py-2 lg:flex":
          !isDialog,
      })}
    >
      <div className="flex items-center gap-1.5">
        <Avatar>
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="break-words font-bold leading-tight">
            {user.firstName} {user.lastName}{" "}
            {!user.firstName && !user.lastName && user.username}
          </div>
          <div className="flex gap-1 break-words text-xs text-muted-foreground">
            u/{user.username}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Onions</div>
          <div className="flex items-center gap-1">
            <Icon iconNode={onion} className="size-4" />
            <div className="text-xs text-zinc-500">
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(getOnions(user))}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Onion day</div>
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
            <h1 className="text-sm uppercase text-muted-foreground">
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
                    <Link
                      href={`/r/${community.name}`}
                      className="max-w-[15rem] cursor-pointer font-medium lowercase hover:underline"
                    >
                      r/{community.name}
                    </Link>
                    <div>
                      {new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(community.usersToCommunities.length)}{" "}
                      {community.usersToCommunities.length === 1
                        ? "member"
                        : "members"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
