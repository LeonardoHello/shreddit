import Image from "next/image";
import Link from "next/link";

import { currentUser } from "@clerk/nextjs/server";
import { PlusIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { ChartBarIcon, HomeIcon } from "@heroicons/react/24/solid";

export default async function MenuDropdown({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) throw new Error("Couldn't fetch user information.");

  return (
    <div className="absolute top-full flex max-h-[min(calc(100vh-3rem),24rem)] w-64 flex-col gap-5 overflow-x-hidden rounded-b border-x border-b border-zinc-700/70 bg-inherit py-4 lg:w-full">
      {children}

      <div className="flex flex-col gap-2.5">
        <h2 className="px-6 text-2xs uppercase text-zinc-300/60">feeds</h2>
        <menu className="w-full self-center">
          <li>
            <Link
              href="/home"
              className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
            >
              <HomeIcon className="h-5 w-5" />
              <h2 className="capitalize">home</h2>
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
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

      <div className="flex flex-col gap-2">
        <h2 className="px-6 text-2xs uppercase text-zinc-300/60">other</h2>
        <menu className="w-full self-center">
          <li>
            <Link
              href={`/u/${user.username}`}
              className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
            >
              <Image
                src={user.imageUrl}
                alt="profile icon"
                width={24}
                height={24}
                className="rounded-full"
              />

              <h2 className="capitalize">user profile</h2>
            </Link>
          </li>
          <li>
            <Link
              href="/submit"
              className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
            >
              <PlusIcon className="h-6 w-6 stroke-2 text-zinc-300" />
              <h2 className="capitalize">create post</h2>
            </Link>
          </li>
          <li>
            <Link
              href={{ query: { purchase: "premium" } }}
              className="flex h-9 items-center gap-2 px-6 text-sm hover:bg-zinc-700/30"
            >
              <ShieldCheckIcon className="h-6 w-6 text-zinc-300" />
              <h2 className="capitalize">premium</h2>
            </Link>
          </li>
        </menu>
      </div>
    </div>
  );
}
