import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import { Skeleton } from "../ui/skeleton";

export default function PostSkeleton() {
  return (
    <div className="flex w-full gap-3 rounded border bg-card p-2">
      <div className="flex select-none flex-col items-center gap-1 text-muted-foreground">
        <ArrowUpCircle className="size-6 rounded" />
        <Skeleton className="h-3 w-4" />
        <ArrowDownCircle className="size-6 rounded" />
      </div>
      <div className="flex grow flex-col gap-2">
        <Skeleton className="mb-2 h-3 w-2/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
