import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";

export default function FeedLoading() {
  return (
    <div className="relative h-48">
      <div className="absolute left-0 top-0 flex h-96 w-full cursor-pointer gap-4 rounded border border-zinc-700/70 bg-zinc-900 p-2 hover:border-zinc-500">
        <div className="flex select-none flex-col items-center gap-4 text-zinc-500">
          <ArrowUpCircleIcon className="h-8 w-8 rounded" />
          <ArrowDownCircleIcon className="h-8 w-8 rounded" />
        </div>
        <div className="flex grow animate-pulse flex-col gap-2">
          <div className="mb-2 ml-2 h-3 w-2/5 rounded bg-zinc-700" />
          <div className="h-5 w-1/2 rounded bg-zinc-700" />
          <div className="h-3 grow rounded bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}
