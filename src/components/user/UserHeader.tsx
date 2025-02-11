"use client";

import Image from "next/image";

import { trpc } from "@/trpc/client";
import userBanner from "@public/userBanner.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserNavigation from "./UserNavigation";
import UserSidebar from "./UserSidebar";

export default function UserHeader({ username }: { username: string }) {
  const [user] = trpc.user.getUserByName.useSuspenseQuery(username);

  return (
    <div className="flex flex-col rounded-lg border bg-card">
      <Image
        src={userBanner}
        alt="shrek themed community banner"
        className="h-20 w-full rounded-t-lg object-cover lg:h-32"
        placeholder="blur"
      />

      <div className="flex flex-row items-center justify-between gap-4 px-4 py-2.5">
        <div className="flex items-center gap-2 lg:max-h-10">
          <Avatar className="size-12 border-card bg-card lg:size-24 lg:self-end lg:border-4">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-1">
              <h1 className="self-center break-all text-lg font-bold leading-none lg:text-2xl">
                {user.username}
              </h1>

              <UserSidebar username={username} isDialog />
            </div>

            <div className="break-all text-xs text-muted-foreground">
              u/{user.username}
            </div>
          </div>
        </div>

        <UserNavigation username={user.username} />
      </div>
    </div>
  );
}
