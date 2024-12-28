import Link from "next/link";

import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function PremiumButton() {
  return (
    <div className="flex flex-col gap-2 rounded border border-zinc-700/70 bg-zinc-900 px-3 py-2">
      <div className="flex gap-2">
        <ShieldCheckIcon className="h-7 w-7 text-rose-500" />
        <div className="flex flex-col gap-0.5 text-xs">
          <h2 className="font-medium">Shreddit Premium</h2>
          <p>The best Shreddit experience</p>
        </div>
      </div>

      <Link
        href={{ query: { purchase: "premium" } }}
        scroll={false}
        className="rounded-full"
      >
        <button className="w-full rounded-full bg-rose-500 p-1.5 text-sm font-bold text-white transition-colors hover:bg-rose-400">
          Try Now
        </button>
      </Link>
    </div>
  );
}
