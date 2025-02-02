import { Skeleton } from "../ui/skeleton";

export default function CommunityHeaderSkeleton() {
  return (
    <Skeleton className="rounded-lg border bg-card">
      <Skeleton className="h-20 w-full rounded-b-none rounded-t-lg md:h-32" />

      <div className="flex flex-col justify-between gap-4 px-4 py-2.5 md:flex-row md:items-center">
        <div className="flex items-center gap-2 lg:max-h-10">
          <div className="z-10 rounded-full bg-card lg:self-end">
            <Skeleton className="size-12 rounded-full border-card lg:size-24 lg:border-4" />
          </div>
          <Skeleton className="h-8 w-40 self-center" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-32 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>
    </Skeleton>
  );
}
