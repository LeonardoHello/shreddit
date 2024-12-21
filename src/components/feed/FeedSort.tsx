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

import { PostSort } from "@/types";
import cn from "@/utils/cn";

export default function FeedSort({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pathname = usePathname();

  const { sort, filter } = searchParams;

  const defaultSort = !(
    sort === PostSort.HOT ||
    sort === PostSort.NEW ||
    sort === PostSort.CONTROVERSIAL
  );

  return (
    <nav className="rounded border border-zinc-700/70 bg-zinc-900 px-3 py-2 text-base">
      <ul className="flex justify-around gap-3 font-bold text-zinc-500">
        <li>
          <Link
            href={{
              pathname,
              query: { sort: PostSort.BEST, ...(filter && { filter }) },
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
              query: { sort: PostSort.HOT, ...(filter && { filter }) },
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  sort === PostSort.HOT,
              },
            )}
          >
            {sort === PostSort.HOT ? (
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
              query: { sort: PostSort.NEW, ...(filter && { filter }) },
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  sort === PostSort.NEW,
              },
            )}
          >
            {sort === PostSort.NEW ? (
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
                sort: PostSort.CONTROVERSIAL,
                ...(filter && { filter }),
              },
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  sort === PostSort.CONTROVERSIAL,
              },
            )}
          >
            {sort === PostSort.CONTROVERSIAL ? (
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
