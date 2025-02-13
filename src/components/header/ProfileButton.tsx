"use client";

import { useRouter } from "next/navigation";

import { UserButton, useUser } from "@clerk/nextjs";
import { User } from "lucide-react";

import { Skeleton } from "../ui/skeleton";

export default function ProfileButton() {
  const router = useRouter();

  const { user } = useUser();

  if (!user) {
    return <Skeleton className="size-8 rounded-full" />;
  }

  return (
    <div
      className="flex items-center"
      onMouseEnter={() => {
        router.prefetch(`/u/${user.username}`);
      }}
      onTouchStart={() => {
        router.prefetch(`/u/${user.username}`);
      }}
    >
      <UserButton appearance={{ elements: { userButtonAvatarBox: "size-8" } }}>
        <UserButton.MenuItems>
          <UserButton.Link
            label="Profile"
            labelIcon={<User className="size-4 stroke-[2.5]" />}
            href={`/u/${user.username}`}
          />
          <UserButton.Action label="manageAccount" />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
}
