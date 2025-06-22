import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Button variant={"outline"} className="border-border h-10 w-60 sm:w-72">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-3 w-24" />
        <ChevronDown className="text-muted-foreground ml-auto size-5" />
      </Button>

      <Button className="order-2 self-end rounded-full" disabled>
        Post
      </Button>
    </>
  );
}
