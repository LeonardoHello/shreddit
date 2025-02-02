import Link from "next/link";

import { currentUser as currentUserPromise } from "@clerk/nextjs/server";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export default async function SidebarNavUser() {
  const user = await currentUserPromise();

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <li>
      <Button
        variant="ghost"
        size="lg"
        className="w-full justify-start px-4 text-sm font-normal hover:bg-accent/40"
        asChild
      >
        <Link href={`/u/${user.username}`}>
          <Avatar className="size-6">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="uppercase">
              {user.username?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <h2 className="capitalize">view profile</h2>
        </Link>
      </Button>
    </li>
  );
}
