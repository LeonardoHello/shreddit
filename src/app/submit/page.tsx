import { ChevronDown, CircleDashed } from "lucide-react";

import SubmitCommunity from "@/components/submit/SubmitCommunity";
import { Button } from "@/components/ui/button";

export default function SubmitPage() {
  return (
    <>
      <SubmitCommunity>
        <Button variant={"outline"} className="h-10 w-60 border-border sm:w-72">
          <CircleDashed className="size-6 text-muted-foreground" />
          <span>Choose a community</span>
          <ChevronDown className="ml-auto size-5 text-muted-foreground" />
        </Button>
      </SubmitCommunity>

      <Button className="order-2 self-end rounded-full" disabled>
        Post
      </Button>
    </>
  );
}
