import { ChevronDown, CircleDashed } from "lucide-react";

import SubmitButtonFake from "@/components/submit/SubmitButtonFake";
import SubmitCommunity from "@/components/submit/SubmitCommunity";
import { Button } from "@/components/ui/button";

export default function SubmitPage() {
  return (
    <>
      <SubmitCommunity>
        <Button variant={"outline"} className="border-border h-10 w-60 sm:w-72">
          <CircleDashed className="text-muted-foreground size-6" />
          <span>Choose a community</span>
          <ChevronDown className="text-muted-foreground ml-auto size-5" />
        </Button>
      </SubmitCommunity>

      <SubmitButtonFake />
    </>
  );
}
