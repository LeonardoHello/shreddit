import { Ellipsis } from "lucide-react";

import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function UserHeaderSkeleton() {
  const tabs = ["Posts", "Saved", "Hidden", "Upvoted", "Downvoted"];

  return (
    <div className="rounded-lg border bg-card">
      <Skeleton className="h-20 w-full rounded-b-none rounded-t-lg lg:h-32" />

      <div className="flex items-center justify-between gap-4 px-4 py-2.5">
        <div className="flex items-center gap-2 lg:max-h-10">
          <div className="z-10 rounded-full bg-card lg:self-end">
            <Skeleton className="size-12 rounded-full border-card lg:size-24 lg:border-4" />
          </div>
          <Skeleton className="h-8 w-40 self-center" />
        </div>

        <ul className="hidden gap-2 lg:flex">
          {tabs.map((tab) => (
            <li key={tab}>
              <Button variant={"outline"} disabled className="rounded-full">
                {tab}
              </Button>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          size="icon"
          disabled
          className="min-w-9 rounded-full lg:hidden"
        >
          <Ellipsis className="size-5" />
        </Button>
      </div>
    </div>
  );
}
