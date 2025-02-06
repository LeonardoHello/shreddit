import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Button variant={"outline"} className="h-10 w-60 border-border sm:w-72">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-3 w-24" />
        <ChevronDown className="ml-auto size-5 text-muted-foreground" />
      </Button>

      <Button
        className="order-2 cursor-not-allowed self-end rounded-full"
        disabled
      >
        Post
      </Button>
    </>
  );
}
