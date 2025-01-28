import { Skeleton } from "../ui/skeleton";

export default function PostSkeleton({
  postContentHeight,
}: {
  postContentHeight?: number;
}) {
  return (
    <div className="flex w-full flex-col gap-3 rounded border bg-card px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="size-7 rounded-full" />
      </div>
      <div className="flex grow flex-col gap-3">
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-80" style={{ height: postContentHeight }} />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-[4.5rem] rounded-full" />
        <Skeleton className="h-8 w-14 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}
