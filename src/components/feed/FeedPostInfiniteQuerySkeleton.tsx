import { ChevronDown } from "lucide-react";

import PostSkeleton from "../post/PostSkeleton";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function FeedPostInfiniteQuerySkeleton({
  withoutButton = false,
}: {
  withoutButton?: boolean;
}) {
  return (
    <div className="flex grow flex-col gap-2">
      {!withoutButton && (
        <Button
          variant={"outline"}
          disabled
          className="border-border self-start"
        >
          <Skeleton className="h-4 w-10" />
          <ChevronDown className="size-4" />
        </Button>
      )}

      {Array.from({ length: 3 }).map((_, index) => (
        <PostSkeleton key={index} postContentHeight={(index + 2) * 100} />
      ))}
    </div>
  );
}
