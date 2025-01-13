import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import { Skeleton } from "../ui/skeleton";
import FeedSort from "./FeedSort";

export default function FeedPostInfiniteQuerySkeleton() {
  return (
    <div className="flex grow flex-col gap-2.5">
      <FeedSort />

      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex w-full gap-3 rounded border bg-card p-2 hover:border-ring"
        >
          <div className="flex select-none flex-col items-center gap-1 text-muted-foreground">
            <ArrowUpCircle className="size-6 rounded" />
            <Skeleton className="h-3 w-4" />
            <ArrowDownCircle className="size-6 rounded" />
          </div>
          <div className="flex grow animate-pulse flex-col gap-2">
            <Skeleton className="mb-2 h-3 w-2/5" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton style={{ height: `${384 - ((index * 100) % 300)}px` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
