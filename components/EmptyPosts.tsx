import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";

export default function EmptyPosts() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const filter = searchParams.get("filter");

  return (
    <div className="relative flex flex-col border border-zinc-700/30">
      {[0, 1, 2, 3, 4].map((_) => (
        <div key={_} className="flex gap-2 bg-zinc-900 p-2 opacity-30">
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
        {filter || pathname.startsWith("/u") ? (
          <h1 className="text-lg font-medium">
            hmm... looks like nothing has been {filter || "posted"} yet
          </h1>
        ) : (
          <>
            <h1 className="text-lg font-medium">
              There are no posts in this subreddit
            </h1>
            <h2 className="text-sm">Be the first to till this fertile land.</h2>
          </>
        )}

        {!filter && (
          <Link href="/submit" className="rounded-full bg-zinc-300 px-12">
            <button className="w-full rounded-full  p-1.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-400">
              Create Post
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
