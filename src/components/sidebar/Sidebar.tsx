import Link from "next/link";

import { auth } from "@clerk/nextjs/server";
import { ChartBarIcon, HomeIcon } from "@heroicons/react/24/solid";

import SidebarMenuJoined from "./SidebarMenuJoined";
import SidebarMenuModerated from "./SidebarMenuModerated";
import SidebarMenuRecent from "./SidebarMenuRecent";

export default async function Sidebar() {
  const { userId } = await auth();

  return (
    <div
      style={{ scrollbarWidth: "thin", colorScheme: "dark" }}
      className="sticky top-14 h-[calc(100vh-3.5rem)] w-[272px] gap-3 overflow-y-auto border-r bg-card p-4"
    >
      <div className="flex flex-col gap-2.5">
        <menu className="w-full self-center">
          <li>
            <Link
              href="/home"
              className="flex h-9 items-center gap-2 rounded-md px-6 text-sm hover:bg-zinc-700/30"
            >
              <HomeIcon className="h-5 w-5" />
              <h2 className="capitalize">home</h2>
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="flex h-9 items-center gap-2 rounded-md px-6 text-sm hover:bg-zinc-700/30"
            >
              <ChartBarIcon
                className="h-5 w-5 rounded-full bg-zinc-300 stroke-[3] p-0.5 text-zinc-900"
                width={20}
                height={20}
              />
              <h2>All</h2>
            </Link>
          </li>
        </menu>
      </div>

      <SidebarMenuRecent />

      {userId && (
        <>
          <SidebarMenuModerated />
          <SidebarMenuJoined />
        </>
      )}
    </div>
  );
}
