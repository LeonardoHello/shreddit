import Image from "next/image";
import Link from "next/link";

import { ChartBarIcon } from "@heroicons/react/24/solid";

import FeedSort from "@/components/FeedSort";
import Premium from "@/components/Premium";
import galaxy from "@/public/galaxy.jpg";

export const runtime = "edge";

export default function AllLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex grow justify-center gap-6 p-2 py-4 lg:w-full lg:max-w-5xl lg:self-center">
      <div className="flex basis-full flex-col gap-4 lg:basis-2/3">
        <FeedSort />
        {children}
      </div>
      <div className="hidden basis-1/3 text-sm lg:flex lg:flex-col lg:gap-4">
        <Premium />
        <div className="relative flex flex-col gap-3 rounded border border-zinc-700/70 bg-zinc-900 p-3 pt-2">
          <Image
            src={galaxy}
            alt="galaxy"
            priority
            quality={10}
            className="absolute left-0 top-0 h-8 rounded-t object-cover object-bottom "
          />
          <div className="z-10 mt-4 flex items-center gap-2">
            <ChartBarIcon
              className="h-7 w-7 rounded-full bg-zinc-300 stroke-[3] p-0.5 text-zinc-900"
              width={20}
              height={20}
            />
            <h1>All</h1>
          </div>
          <p className="text-sm">
            The most active posts from all of Shreddit. Come here to see new
            posts rising and be a part of the conversation.
          </p>
          <hr className="border-zinc-700/70" />
          <Link href="/submit" className="rounded-full">
            <button className="w-full rounded-full bg-zinc-300 p-1.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-400">
              Create Post
            </button>
          </Link>
          <Link href="/submit" className="rounded-full">
            <button className="w-full rounded-full border border-zinc-300 p-1.5 text-sm font-bold text-zinc-300 transition-colors hover:bg-zinc-800">
              Create Community
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
