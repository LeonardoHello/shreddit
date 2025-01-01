"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  ChatBubbleBottomCenterTextIcon,
  FireIcon,
  RocketLaunchIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconSolid,
  FireIcon as FireIconSolid,
  RocketLaunchIcon as RocketLaunchIconSolid,
  TagIcon as TagIconSolid,
} from "@heroicons/react/24/solid";

import { PostSort } from "@/types";
import { cn } from "@/utils/cn";

export default function FeedSort() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") as PostSort | undefined;

  const defaultSort = !(
    sort && [PostSort.HOT, PostSort.NEW, PostSort.CONTROVERSIAL].includes(sort)
  );

  return (
    <nav className="rounded border border-zinc-700/70 bg-zinc-900 px-3 py-2 text-base">
      <ul className="flex justify-around gap-3 font-bold text-zinc-500">
        <li>
          <Link
            href={{
              pathname,
              query: { sort: PostSort.BEST },
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  defaultSort,
              },
            )}
          >
            {defaultSort && <RocketLaunchIconSolid className="h-6 w-6" />}
            {!defaultSort && <RocketLaunchIcon className="h-6 w-6" />}
            <span className="hidden sm:inline-block">Best</span>
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname,
              query: { sort: PostSort.HOT },
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  sort === PostSort.HOT,
              },
            )}
          >
            {sort === PostSort.HOT && <FireIconSolid className="h-6 w-6" />}
            {sort !== PostSort.HOT && <FireIcon className="h-6 w-6" />}
            <span className="hidden sm:inline-block">Hot</span>
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname,
              query: { sort: PostSort.NEW },
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  sort === PostSort.NEW,
              },
            )}
          >
            {sort === PostSort.NEW && <TagIconSolid className="h-6 w-6" />}
            {sort !== PostSort.NEW && <TagIcon className="h-6 w-6" />}
            <span className="hidden sm:inline-block">New</span>
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname,
              query: {
                sort: PostSort.CONTROVERSIAL,
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
            {sort === PostSort.CONTROVERSIAL && (
              <ChatBubbleBottomCenterTextIconSolid className="h-6 w-6" />
            )}
            {sort !== PostSort.CONTROVERSIAL && (
              <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
            )}
            <span className="hidden sm:inline-block">Controversial</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
