"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ChatBubbleBottomCenterTextIcon,
  FireIcon,
  RocketLaunchIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleBottomCenterTextIcon as SolidChatBubbleBottomCenterTextIcon,
  FireIcon as SolidFireIcon,
  RocketLaunchIcon as SolidRocketLaunchIcon,
  TagIcon as SolidTagIcon,
} from "@heroicons/react/24/solid";

import { SortPosts } from "@/lib/types";
import cn from "@/lib/utils/cn";

export default function FeedSort({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pathname = usePathname();

  const { sort, filter } = searchParams;

  const defaultSort = !(
    sort === SortPosts.HOT ||
    sort === SortPosts.NEW ||
    sort === SortPosts.CONTROVERSIAL
  );

  return (
    <nav className="rounded border border-zinc-700/70 bg-zinc-900 px-3 py-2 text-base">
      <ul className="flex justify-around gap-3 font-bold text-zinc-500">
        <li>
          <Link
            href={{
              pathname,
              query: { sort: SortPosts.BEST, ...(filter && { filter }) },
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  defaultSort,
              },
            )}
          >
            {defaultSort ? (
              <SolidRocketLaunchIcon className="h-6 w-6" />
            ) : (
              <RocketLaunchIcon className="h-6 w-6" />
            )}
            <span className="hidden sm:inline-block">Best</span>
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname,
              query: { sort: SortPosts.HOT, ...(filter && { filter }) },
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  sort === SortPosts.HOT,
              },
            )}
          >
            {sort === SortPosts.HOT ? (
              <SolidFireIcon className="h-6 w-6" />
            ) : (
              <FireIcon className="h-6 w-6" />
            )}
            <span className="hidden sm:inline-block">Hot</span>
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname,
              query: { sort: SortPosts.NEW, ...(filter && { filter }) },
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  sort === SortPosts.NEW,
              },
            )}
          >
            {sort === SortPosts.NEW ? (
              <SolidTagIcon className="h-6 w-6" />
            ) : (
              <TagIcon className="h-6 w-6" />
            )}
            <span className="hidden sm:inline-block">New</span>
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname,
              query: {
                sort: SortPosts.CONTROVERSIAL,
                ...(filter && { filter }),
              },
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  sort === SortPosts.CONTROVERSIAL,
              },
            )}
          >
            {sort === SortPosts.CONTROVERSIAL ? (
              <SolidChatBubbleBottomCenterTextIcon className="h-6 w-6" />
            ) : (
              <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
            )}
            <span className="hidden sm:inline-block">Controversial</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
