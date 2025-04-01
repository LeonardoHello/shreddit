import { ChevronDown } from "lucide-react";

import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function UserHeaderSkeleton() {
  const tabs = ["Posts", "Saved", "Hidden", "Upvoted", "Downvoted"];

  return (
    <div className="bg-card rounded-lg border">
      <Skeleton className="h-20 w-full rounded-t-lg rounded-b-none lg:h-32" />

      <div className="flex items-center justify-between gap-4 px-4 py-2.5">
        <div className="flex items-center gap-2 lg:max-h-10">
          <div className="bg-card z-10 rounded-full lg:self-end">
            <Skeleton className="border-card size-12 rounded-full lg:size-24 lg:border-4" />
          </div>
          <Skeleton className="h-8 w-40 self-center" />
        </div>

        <ul className="hidden gap-2 xl:flex">
          {tabs.map((tab) => (
            <li key={tab}>
              <Button variant={"link"} disabled>
                {tab}
              </Button>
            </li>
          ))}
        </ul>

        <Button className="xl:hidden">
          <Skeleton className="h-4 w-12" />
          <ChevronDown className="size-4" />
        </Button>
      </div>
    </div>
  );
}
