import { ChevronUp, Star } from "lucide-react";

import { Skeleton } from "../ui/skeleton";

export default function SidebarNavSkeleton({
  length,
  canFavorite,
}: {
  length: number;
  canFavorite?: boolean;
}) {
  return (
    <nav>
      <ul className="px-4 py-2">
        <div className="flex flex-1 items-center justify-between px-2 py-3">
          <Skeleton className="h-3 w-24" />
          <ChevronUp className="text-muted-foreground size-4 shrink-0" />
        </div>
        <div className="flex flex-col gap-1 pb-4">
          {Array.from({ length }).map((_, index) => (
            <li key={index} className="flex h-10 items-center gap-2 px-4 py-2">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton
                className="h-4"
                style={{ width: `${60 + ((index * 20) % 60)}px` }}
              />
              {canFavorite && (
                <Star className="fill-primary/10 text-primary/10 ml-auto size-5 animate-pulse stroke-1" />
              )}
            </li>
          ))}
        </div>
      </ul>
    </nav>
  );
}
