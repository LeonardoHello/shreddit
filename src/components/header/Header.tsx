import Link from "next/link";

import { Plus } from "lucide-react";

import { getSession } from "@/app/actions";
import { Button } from "../ui/button";
import ProfileButton from "./ProfileButton";
import { Search } from "./Search";
import SignInButton from "./SignInButton";

export default async function Header({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <header className="bg-card sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4">
      {children}

      <Search />

      {session && (
        <div className="flex items-center gap-3">
          <Button variant={"secondary"} className="w-9 md:w-auto" asChild>
            <Link href={"/submit"}>
              <Plus className="stroke-[1.5]" viewBox="4 4 16 16" />
              <span className="hidden md:inline-block">Create</span>
            </Link>
          </Button>

          <ProfileButton />
        </div>
      )}

      {!session && <SignInButton />}
    </header>
  );
}
