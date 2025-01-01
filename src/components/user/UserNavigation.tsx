"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/cn";

export default function UserNavigation({ username }: { username: string }) {
  const pathname = usePathname();

  return (
    <div className="flex justify-center border-b border-zinc-700/70 bg-zinc-900">
      <div className="flex w-[72rem] flex-wrap gap-x-6 gap-y-2 px-2 py-2.5 text-sm font-medium uppercase">
        <Link
          href={`/u/${username}`}
          className={cn("border-b-2 border-transparent", {
            "border-zinc-300": pathname.endsWith(`/${username}`),
            "hover:border-zinc-300/40": !pathname.endsWith(`/${username}`),
          })}
        >
          overview
        </Link>
        <Link
          href={`/u/${username}/saved`}
          className={cn("border-b-2 border-transparent", {
            "border-zinc-300": pathname.endsWith("/saved"),
            "hover:border-zinc-300/40": !pathname.endsWith("/saved"),
          })}
        >
          saved
        </Link>
        <Link
          href={`/u/${username}/hidden`}
          className={cn("border-b-2 border-transparent", {
            "border-zinc-300": pathname.endsWith("/hidden"),
            "hover:border-zinc-300/40": !pathname.endsWith("/hidden"),
          })}
        >
          hidden
        </Link>
        <Link
          href={`/u/${username}/upvoted`}
          className={cn("border-b-2 border-transparent", {
            "border-zinc-300": pathname.endsWith("/upvoted"),
            "hover:border-zinc-300/40": !pathname.endsWith("/upvoted"),
          })}
        >
          upvoted
        </Link>
        <Link
          href={`/u/${username}/downvoted`}
          className={cn("border-b-2 border-transparent", {
            "border-zinc-300": pathname.endsWith("/downvoted"),
            "hover:border-zinc-300/40": !pathname.endsWith("/downvoted"),
          })}
        >
          downvoted
        </Link>
      </div>
    </div>
  );
}
