import Link from "next/link";

import { LogIn, Plus } from "lucide-react";

import { getSession } from "@/app/actions";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { Search } from "./Search";
import UserDropdownMenu from "./UserDropdownMenu";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="bg-card sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4">
      <SidebarTrigger className="-ml-1 [&_svg]:stroke-[1.5]" />

      <Search />

      {session && (
        <div className="flex items-center gap-3">
          <Button variant={"outline"} className="w-9 md:w-auto" asChild>
            <Link href={"/submit"}>
              <Plus className="stroke-[1.5]" viewBox="4 4 16 16" />
              <span className="hidden md:inline-block">Create</span>
            </Link>
          </Button>

          <UserDropdownMenu
            name={session.user.name}
            username={session.user.username}
            userImage={session.user.image}
          />
        </div>
      )}

      {!session && (
        <Button asChild>
          <Link href="/sign-in">
            <LogIn />
            <span>Sign in</span>
          </Link>
        </Button>
      )}
    </header>
  );
}
