import Link from "next/link";

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Plus } from "lucide-react";

import Logo from "@/components/header/Logo";
import Search from "@/components/header/Search";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 col-span-2 flex h-14 justify-between gap-5 border-b bg-card px-4 py-2">
      <div className="flex select-none items-center gap-1.5">
        {/* sidebar */}
        {children}

        <Logo />
      </div>

      <Search />

      <SignedIn>
        <div className="flex items-center gap-2 self-center">
          <Button
            variant={"ghost"}
            className="w-9 rounded-full sm:w-auto"
            asChild
          >
            <Link href={"/submit"}>
              <Plus className="size-5 stroke-1" viewBox="4 4 16 16" />
              <span className="hidden sm:inline-block">Create</span>
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
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex items-center gap-2 self-center">
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
