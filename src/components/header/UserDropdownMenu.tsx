"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { LogOut, User, UserCog } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserSchema } from "@/db/schema/users";
import { authClient } from "@/lib/auth-client";
import donkey from "@public/donkey.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export default function UserDropdownMenu({
  name,
  username,
  userImage,
}: {
  name: string;
  username: string | null | undefined;
  userImage: string | null | undefined;
}) {
  const router = useRouter();

  const parsedUsername = UserSchema.shape.username.unwrap().parse(username);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full bg-white ring-[#91C14B] hover:ring-2 dark:hover:bg-white"
          asChild
        >
          <Avatar className="size-8">
            <AvatarImage src={userImage ?? donkey.src} />
            <AvatarFallback className="uppercase">
              {parsedUsername.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src={userImage ?? donkey.src} />
            <AvatarFallback className="uppercase">
              {parsedUsername.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{name}</span>
            <span className="text-muted-foreground text-xs">
              u/{parsedUsername}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/u/${parsedUsername}`}>
            <User />
            <span>User Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/manage-account"}>
            <UserCog />
            <span>Manage Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.refresh();
                },
              },
            });
          }}
        >
          <LogOut />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
