import { ChevronDown, CircleDashed } from "lucide-react";

import { getSession } from "@/app/actions";
import SubmitButtonFake from "@/components/submit/SubmitButtonFake";
import SubmitCommunity from "@/components/submit/SubmitCommunity";
import { Button } from "@/components/ui/button";

export default async function SubmitPage() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthenticated");
  }

  return (
    <>
      <SubmitCommunity currentUserId={session.session.userId}>
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
