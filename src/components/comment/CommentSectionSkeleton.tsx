import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { Skeleton } from "../ui/skeleton";

export default function CommentSectionSkeleton() {
  return (
    <div className="flex grow flex-col gap-6">
      <div className="flex flex-col gap-6">
        <CommentSkeleton>
          <CommentSkeleton>
            <CommentSkeleton />
          </CommentSkeleton>
          <CommentSkeleton />
        </CommentSkeleton>
        <CommentSkeleton />
      </div>
    </div>
  );
}

function CommentSkeleton({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex select-none items-center gap-1 text-muted">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>

      <div className="ml-3 flex grow flex-col gap-2 border-l-2 pl-4">
        <Skeleton className="h-12" />
        <div className="flex items-center gap-2">
          <div className="flex select-none items-center gap-1 text-muted">
            <ArrowBigUp className="size-6 rounded" />
            <Skeleton className="h-3 w-4" />
            <ArrowBigDown className="size-6 rounded" />
          </div>
          <Skeleton className="h-4 w-14" />
        </div>
        {children}
      </div>
    </div>
  );
}
