"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import cn from "@/lib/utils/cn";

export default function UserNavigation({ userName }: { userName: string }) {
  const pathname = usePathname();

  const defaultNav = !(
    pathname.endsWith("/saved") ||
    pathname.endsWith("/hidden") ||
    pathname.endsWith("/upvoted") ||
    pathname.endsWith("/downvoted")
  );

  return (
    <div className="flex w-[64rem] flex-wrap gap-x-6 gap-y-2 px-2 py-2.5 text-sm font-medium uppercase">
      <Link
        href={`/u/${userName}`}
        className={cn("border-b-2 border-transparent", {
          "border-zinc-300": defaultNav,
          "hover:border-zinc-300/40": !defaultNav,
        })}
      >
        overview
      </Link>
      <Link
        href={`/u/${userName}/saved`}
        className={cn("border-b-2 border-transparent", {
          "border-zinc-300": pathname.endsWith("/saved"),
          "hover:border-zinc-300/40": !pathname.endsWith("/saved"),
        })}
      >
        saved
      </Link>
      <Link
        href={`/u/${userName}/hidden`}
        className={cn("border-b-2 border-transparent", {
          "border-zinc-300": pathname.endsWith("/hidden"),
          "hover:border-zinc-300/40": !pathname.endsWith("/hidden"),
        })}
      >
        hidden
      </Link>
      <Link
        href={`/u/${userName}/upvoted`}
        className={cn("border-b-2 border-transparent", {
          "border-zinc-300": pathname.endsWith("/upvoted"),
          "hover:border-zinc-300/40": !pathname.endsWith("/upvoted"),
        })}
      >
        upvoted
      </Link>
      <Link
        href={`/u/${userName}/downvoted`}
        className={cn("border-b-2 border-transparent", {
          "border-zinc-300": pathname.endsWith("/downvoted"),
          "hover:border-zinc-300/40": !pathname.endsWith("/downvoted"),
        })}
      >
        downvoted
      </Link>
    </div>
  );
}
