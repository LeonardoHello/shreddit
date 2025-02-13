import Link from "next/link";

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/nextjs";
import { Plus } from "lucide-react";

import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import ProfileButton from "./ProfileButton";
import { Search } from "./Search";

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card px-4">
      {children}

      <Search />

      <SignedIn>
        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            className="w-9 rounded-full md:w-auto"
            asChild
          >
            <Link href={"/submit"}>
              <Plus className="size-5 stroke-1" viewBox="4 4 16 16" />
              <span className="hidden md:inline-block">Create</span>
            </Link>
          </Button>

          <ClerkLoading>
            <Skeleton className="size-8 rounded-full" />
          </ClerkLoading>
          <ClerkLoaded>
            <ProfileButton />
          </ClerkLoaded>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex items-center gap-2">
          <ClerkLoading>
            <Button className="rounded-full bg-rose-600 text-foreground hover:bg-rose-600/90">
              Sign in
            </Button>
          </ClerkLoading>
          <ClerkLoaded>
            <SignInButton mode="modal">
              <Button className="rounded-full bg-rose-600 text-foreground hover:bg-rose-600/90">
                Sign in
              </Button>
            </SignInButton>
          </ClerkLoaded>
        </div>
      </SignedOut>
    </header>
  );
}
