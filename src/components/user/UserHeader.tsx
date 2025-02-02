import Image from "next/image";

import { User } from "@clerk/nextjs/server";
import { Info } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RouterOutput } from "@/trpc/routers/_app";
import userBackground from "@public/userBackground.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import UserNavigation from "./UserNavigation";
import UserSidebar from "./UserSidebar";

export default function UserHeader({
  currentUserId,
  user,
}: {
  currentUserId: User["id"] | null;
  user: NonNullable<RouterOutput["user"]["getUserByName"]>;
}) {
  return (
    <div className="flex flex-col rounded-lg border bg-card">
      <Image
        src={userBackground}
        alt="shrek themed community banner"
        className="h-20 w-full rounded-t-lg object-cover lg:h-32"
        placeholder="blur"
      />

      <div className="flex flex-row items-center justify-between gap-4 px-4 py-2.5">
        <div className="flex items-center gap-2 lg:max-h-12">
          <Avatar className="size-12 border-card bg-card lg:size-24 lg:self-end lg:border-4">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-1">
              <h1 className="self-center break-all text-lg font-bold lg:text-2xl">
                {user.firstName} {user.lastName}{" "}
                {!user.firstName && !user.lastName && user.username}
              </h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-full text-muted-foreground lg:hidden"
                  >
                    <Info className="size-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Community Information</DialogTitle>
                    <DialogDescription>
                      This dialog displays details about the community. Please
                      review the information provided.
                    </DialogDescription>
                  </DialogHeader>
                  <UserSidebar user={user} isDialog />
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-xs text-muted-foreground">
              u/{user.username}
            </div>
          </div>
        </div>

        {currentUserId === user.id && (
          <UserNavigation username={user.username} />
        )}
      </div>
    </div>
  );
}
