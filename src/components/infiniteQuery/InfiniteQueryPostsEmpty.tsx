import Link from "next/link";

import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";

import type { Community, User } from "@/db/schema";
import { PostFilter, PostSort } from "@/types";

export default function InfiniteQueryPostsEmpty({
  params,
  searchParams,
}: {
  params: { userName?: User["name"]; communityName?: Community["name"] };
  searchParams: { sort?: PostSort; filter?: PostFilter };
}) {
  return (
    <div className="relative flex flex-col rounded border border-zinc-700/25">
      {Array.of(4).map((_) => (
        <div key={_} className="flex gap-2 bg-zinc-900 p-2 opacity-20">
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
          hmm... looks like nothing has been {searchParams.filter || "posted"}{" "}
          yet
        </h1>
        {!(params.userName || searchParams.filter) && (
          <>
            <h2 className="text-sm">Be the first to till this fertile land.</h2>
            <Link
              href={{
                pathname: "/submit",
                query: { community: params.communityName },
              }}
              className="rounded-full"
            >
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
