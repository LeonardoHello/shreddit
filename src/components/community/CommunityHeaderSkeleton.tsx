import { Skeleton } from "../ui/skeleton";

export default function CommunityHeaderSkeleton() {
  return (
    <Skeleton className="rounded-lg border bg-card">
      <Skeleton className="h-20 w-full rounded-lg md:h-32" />

      <div className="flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex h-12 items-end gap-2">
          <div className="z-10 rounded-full bg-card">
            <Skeleton className="size-[88px] self-end rounded-full border-2 border-card md:border-4" />
          </div>

          <Skeleton className="h-8 w-40 self-center" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-20 rounded-full" />

          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </Skeleton>
  );
}
