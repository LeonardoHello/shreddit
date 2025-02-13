import React from "react";

import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: 3 }).map((_, index) => (
        <Button key={index} variant={"ghost"} className="h-12 justify-start">
          <Skeleton className="size-7 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </Button>
      ))}
    </div>
  );
}
