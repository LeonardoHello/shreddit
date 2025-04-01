import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export default function CommunitySidebarSkeleton() {
  return (
    <div className="bg-card hidden w-80 flex-col gap-3 self-start rounded-lg border px-3 py-2 xl:flex">
      <Skeleton className="h-5 w-40" />

      <div className="flex flex-col gap-1">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-4/5" />
      </div>

      <div className="flex flex-col gap-1">
        <Skeleton className="h-2.5 w-36" />
        <Skeleton className="h-2.5 w-14" />
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-2">
        <div className="flex basis-1/2 flex-col gap-1">
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex basis-1/2 flex-col gap-1">
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
