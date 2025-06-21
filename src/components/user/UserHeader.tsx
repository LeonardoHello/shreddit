"use client";

import Image from "next/image";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import donkey from "@public/donkey.png";
import userBanner from "@public/userBanner.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserNavigation from "./UserNavigation";
import UserSidebar from "./UserSidebar";

export default function UserHeader({ username }: { username: string }) {
  const trpc = useTRPC();

  const { data: user } = useSuspenseQuery(
    trpc.user.getUserByName.queryOptions(username),
  );

  return (
    <div className="bg-card flex flex-col rounded-lg border">
      <Image
        src={userBanner}
        alt="shrek themed community banner"
        className="h-20 w-full rounded-t-lg object-cover lg:h-32"
        placeholder="blur"
      />

      <div className="flex flex-row items-center justify-between gap-4 px-4 py-2.5">
        <div className="flex items-center gap-2 lg:max-h-10">
          <Avatar className="border-card bg-card size-12 lg:size-24 lg:self-end lg:border-4">
            <AvatarImage src={user.image ?? donkey.src} />
            <AvatarFallback className="uppercase">
              {username.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-1">
              <h1 className="self-center text-lg font-extrabold break-all xl:text-3xl">
                u/{username}
              </h1>

              <UserSidebar username={username} isDialog />
            </div>
            <div className="text-muted-foreground flex gap-1 text-xs xl:hidden">
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(user.onionCount)}{" "}
              {user.onionCount === 1 ? "onion" : "onions"}
            </div>
          </div>
        </div>

        <UserNavigation username={username} />
      </div>
    </div>
  );
}
