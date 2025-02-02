import { Skeleton } from "../ui/skeleton";

export default function UserHeaderSkeleton() {
  return (
    <Skeleton className="rounded-lg border bg-card">
      <Skeleton className="h-20 w-full rounded-b-none rounded-t-lg lg:h-32" />

      <div className="flex items-center justify-between gap-4 px-4 py-2.5">
        <div className="flex items-center gap-2 lg:max-h-10">
          <div className="z-10 rounded-full bg-card lg:self-end">
            <Skeleton className="size-12 rounded-full border-card lg:size-24 lg:border-4" />
          </div>
          <Skeleton className="h-8 w-40 self-center" />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Skeleton className="h-9 w-[90px] rounded-full" />
          <Skeleton className="h-9 w-[70px] rounded-full" />
          <Skeleton className="h-9 w-[78px] rounded-full" />
          <Skeleton className="h-9 w-[86px] rounded-full" />
          <Skeleton className="h-9 w-[104px] rounded-full" />
        </div>
        <Skeleton className="block size-9 rounded-full lg:hidden" />
      </div>
    </Skeleton>
  );
}
