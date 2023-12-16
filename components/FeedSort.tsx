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

import cn from "@/lib/utils/cn";

export default function FeedSort() {
  const pathname = usePathname();

  const path = pathname.replace(/\/(|best|new|hot|controversial)$/, "");

  const defaultSort =
    pathname.endsWith("/best") ||
    !(
      pathname.endsWith("/best") ||
      pathname.endsWith("/hot") ||
      pathname.endsWith("/new") ||
      pathname.endsWith("/controversial")
    );

  return (
    <nav className="rounded border border-zinc-700/70 bg-zinc-900 p-3 text-base">
      <ul className="flex items-center gap-3 font-bold text-zinc-500">
        <li>
          <Link
            href={`${path}/best`}
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
            href={`${path}/hot`}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  pathname.endsWith("/hot"),
              },
            )}
          >
            {pathname.endsWith("/hot") ? (
              <SolidFireIcon className="h-6 w-6" />
            ) : (
              <FireIcon className="h-6 w-6" />
            )}
            <span className="hidden sm:inline-block">Hot</span>
          </Link>
        </li>
        <li>
          <Link
            href={`${path}/new`}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  pathname.endsWith("/new"),
              },
            )}
          >
            {pathname.endsWith("/new") ? (
              <SolidTagIcon className="h-6 w-6" />
            ) : (
              <TagIcon className="h-6 w-6" />
            )}
            <span className="hidden sm:inline-block">New</span>
          </Link>
        </li>
        <li>
          <Link
            href={`${path}/controversial`}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-zinc-700/30",
              {
                "bg-zinc-700/30 text-zinc-300 hover:bg-zinc-700/50":
                  pathname.endsWith("/controversial"),
              },
            )}
          >
            {pathname.endsWith("/controversial") ? (
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
