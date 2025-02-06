import PostSkeleton from "../post/PostSkeleton";
import { Skeleton } from "../ui/skeleton";

export default function FeedPostInfiniteQuerySkeleton() {
  return (
    <div className="flex grow flex-col gap-2.5">
      <div className="flex justify-around gap-2 rounded-lg border bg-card p-2">
        <Skeleton className="h-9 w-14 rounded-full sm:w-[88px]" />
        <Skeleton className="h-9 w-14 rounded-full sm:w-20" />
        <Skeleton className="h-9 w-14 rounded-full sm:w-20" />
        <Skeleton className="h-9 w-14 rounded-full sm:w-36" />
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <PostSkeleton key={index} postContentHeight={(index + 2) * 100} />
      ))}
    </div>
  );
}
