import Link from "next/link";

import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";

import Logo from "@/components/header/Logo";
import Search from "@/components/header/Search";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default async function Header() {
  const { userId } = await auth();

  return (
    <header className="sticky top-0 z-20 col-span-2 flex h-14 justify-between gap-5 border-b bg-card px-4 py-2">
      <Logo />
      <Search />

      <div className="flex items-center gap-2 self-center">
        {userId && (
          <>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="rounded-full md:hidden"
              asChild
            >
              <Link href={"/submit"}>
                <Plus className="size-7 stroke-1" />
              </Link>
            </Button>
            <Button
              variant={"ghost"}
              className="hidden gap-1 rounded-full pl-2.5 pr-3.5 md:flex"
              asChild
            >
              <Link href={"/submit"}>
                <Plus className="size-7 stroke-1" />
                Create
              </Link>
            </Button>

            <ClerkLoading>
              <Skeleton className="size-8 rounded-full" />
            </ClerkLoading>
            <ClerkLoaded>
              <UserButton
                appearance={{ elements: { userButtonAvatarBox: "size-8" } }}
              />
            </ClerkLoaded>
          </>
        )}

        {!userId && (
          <>
            <ClerkLoading>
              <Button variant={"secondary"} className="rounded-full">
                Sign in
              </Button>
            </ClerkLoading>
            <ClerkLoaded>
              <SignInButton mode="modal">
                <Button variant={"secondary"} className="rounded-full">
                  Sign in
                </Button>
              </SignInButton>
            </ClerkLoaded>
          </>
        )}
      </div>
    </header>
  );
}
