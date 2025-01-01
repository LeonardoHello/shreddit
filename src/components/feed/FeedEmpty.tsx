import Link from "next/link";

import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";

import type { Community, User } from "@/db/schema";

export default function FeedEmpty({
  params,
}: {
  params: { username?: User["username"]; communityName?: Community["name"] };
}) {
  return (
    <div className="relative flex flex-col rounded border border-zinc-700/25">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-2 bg-zinc-900 p-2 opacity-20">
          <div className="flex select-none flex-col items-center gap-4 text-zinc-500">
            <ArrowUpCircleIcon className="h-8 w-8 rounded" />
            <ArrowDownCircleIcon className="h-8 w-8 rounded" />
          </div>
          <div className="min-h-full w-32 rounded bg-zinc-700" />
          <div className="flex grow flex-col gap-2">
            <div className="h-6 w-2/3 rounded bg-zinc-700" />
            <div className="h-3 w-2/3 rounded bg-zinc-700" />
            <div className="mt-auto flex h-3 w-1/3 gap-2">
              <div className="w-6 rounded bg-zinc-700" />
              <div className="grow rounded bg-zinc-700" />
            </div>
          </div>
        </div>
      ))}
      <div className="absolute top-1/4 flex flex-col items-center gap-2 self-center p-12 text-center">
        <h1 className="text-lg font-medium">
          hmm... looks like nothing has been posted yet
        </h1>
        {params.username && (
          <>
            <h2 className="text-sm">Be the first to till this fertile land.</h2>
            <Link href="/submit" className="rounded-full">
              <button className="w-full rounded-full bg-zinc-300 p-1.5 px-12 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-400">
                Create Post
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
